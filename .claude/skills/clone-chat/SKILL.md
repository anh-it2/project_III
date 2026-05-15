---
name: clone-chat
description: Architecture + rebuild guide for this project's realtime chat feature (Next.js client + Socket.IO server), including the full auth process you must implement (currently 100% stubbed). Use when working on chat, messages, conversations, reactions, typing, read receipts, pins, groups, unread badges, socket auth, OR when rebuilding the chat / auth from scratch / migrating the in-memory backend to a real database. Triggers on "chat feature", "rebuild chat", "persist messages", "chat DB", "socket auth", "implement auth", "/clone-chat".
---

# clone-chat — Realtime chat: how it works + how to rebuild it

Verified against `social-socket-server/src` (read in full). Where the client *assumes* something the server does not provide, it is called out — those gaps matter for the rebuild.

Two codebases, side by side:

- **Client**: `social-platform/` — Next.js 16 + React 19, Zustand, TanStack Query, Socket.IO client. Chat under `src/feature/chat/`.
- **Server**: `social-socket-server/` — Node + Socket.IO, `tsx watch src/index.ts` (hot-reloads on save), port `3002`. Chat under `src/feature/chat/`. **In-memory only — server restart = all messages/groups/pins lost.** Plain files, not a git repo.

`/chat` Socket.IO namespace carries everything. No REST for chat.

---

## 1. Server bootstrap & auth (`src/index.ts`, `src/socket/`)

- `setup.ts`: one `socket.io` Server, 4 namespaces — `/chat`, `/presence`, `/notification`, `/report`. Each calls `nsp.use(authMiddleware)` (note: `io.use` only covers the root `/` namespace, so auth is per-namespace). CORS `origin:"*"`, `maxHttpBufferSize: 1e6` (**1 MB cap — relevant once media upload is real**), ping 25s / timeout 20s. `onAny` logs every inbound event.
- **Auth is an unverified handshake** (`auth.schema.ts`): zod-validates `socket.handshake.auth` = `{ userId: string, userName?: string, avatar?: string }`, then `socket.data.user = { id, name, avatar }`. **No token, no signature, no verification — any client can claim any `userId`.** This is the single biggest security debt; fix in the rebuild (verify a session/JWT in the handshake).

---

## 2. Core data model

Server `ChatMessage` (`social-socket-server/.../type.ts`):

| Field | Meaning |
|---|---|
| `id` | server `randomUUID()`, assigned on accept |
| `conversationId` | `dm:<a>:<b>` (ids sorted) or `group:<uuid>` |
| `senderId`/`senderName` | author; `senderId:"system"` for group event messages |
| `content` | text / marker / (future) attachment ref |
| `timestamp` | server ms — **this is the history pagination cursor** |
| `type` | `text \| image \| file \| video \| system` |
| `replyTo` | resolved `{ id, senderId, senderName, content, type }` |
| `editedAt`, `deleted` | edit / soft-delete (content blanked) |
| `reactions` | `[{ userId, userName, emoji }]`, one per user |

**There is no `seq` on the server.** The client `types.ts` has `seq` + `readCursors` + `markReadUpTo`, but the server never assigns or sends a sequence number — that ordering is derived client-side from array order. Read receipts travel by **`messageId`**, not seq (see §6).

Conversation id: `buildDmId(a,b)` (`client lib/conversation.ts`) sorts ids so both peers compute the same string. Reactions: 6 fixed keys `like love haha wow sad angry`.

---

## 3. Client state (Zustand)

- **`stores/chat.store.ts`** — `persist` to localStorage. `optimisticMessages[conv][]`, `typingUsers[conv]`, `readCursors[conv]`, `settings[conv]`, `blockedUsers`, `blockedByUsers`, `pinned[conv]`, `groups[conv]`. Methods: `addOptimisticMessage`, `reconcileAck(tempId,server)`, `updateStatus`, `markReadUpTo`, `set/clearTyping`, `pin/unpinMessage`, `setTheme/Emoji/Nickname`, `setBlocked/BlockedBy`, `upsert/removeGroup`, `isBlocked`, `isMuted`.
- **`src/shared/stores/chatRoomUnread.store.ts`** — topnav badge + dropdown. `unread`, `kind` (`message|reaction`), `lastActivity` (recency sort), `activePeerId`. `markUnread(peerId,kind?)` sets all three; `markRead`/`setActivePeer` clear `unread`+`kind` but keep `lastActivity`. Badge = `Object.values(unread).filter(Boolean).length` (`ChatNavBtn.tsx`).
- Keying gotcha: DM unread keyed by **other user's id** (message → `senderId`, reaction → `userId`=reactor); dropdown contacts keyed by `user.id`. Group keyed by `conversationId`. Misalign → badge/sort breaks.
- Smaller stores: `chat-search`, `sidebar-filter`, `pending-selection`, `pinned-messages`.

---

## 4. Socket event catalog (`/chat`)

Client `dto/chat.dto.ts` mirrors `social-socket-server/.../dto/chat.dto.ts`. Keep field names byte-aligned — a field present one side but not emitted the other silently fails guards (the `messageOwnerId` reaction bug was exactly this).

**Server-handled — client → server** (most take an ack):

`chat:join` (also triggers `chat:pins-replay` if pins exist) · `chat:leave` · `chat:message` (→`ChatMessageDTO`) · `chat:history` (→`{messages,nextCursor,hasMore}`) · `chat:edit` · `chat:unsend` · `chat:typing` · `chat:read` · `chat:react` (→`{ok,error?}`) · `chat:pin`/`chat:unpin`/`chat:pins-fetch` · `group:create/leave/kick/promote/mute-member/block-member/delete`

**Server → client**: `chat:message` · `chat:typing` · `chat:read` · `chat:edited` · `chat:unsent` · `chat:reacted` (`ReactionBroadcastDTO`, carries `messageOwnerId`) · `chat:pinned`/`chat:unpinned`/`chat:pins-replay` · `group:created`/`group:updated`/`group:deleted`

**Client-only — NOT handled by the server** (no listener exists in `social-socket-server`): `settings:get`, `settings:setTheme/setEmoji/setNickname/mute`, and all `settings:*Changed` / `e2ee:*` events. `useConversationSettings` emits and listens for these, but the server drops them. **Consequence today: themes / emoji / nicknames / mute / E2EE are local-only (chat.store → localStorage) and do NOT sync to the other participant.** A real rebuild must add a settings handler + persistence if cross-device/peer sync is wanted.

---

## 5. Server architecture (`social-socket-server/src/feature/chat/`)

- `chat.handler.ts` (per connection): `socket.join("user:"+id)`; `addUserSocket` → if it was the user's first socket, `flushPendingMessages`; `rejoinUserGroups` (re-emit `group:created` + join `chat:<conv>` unless blocked); on disconnect `removeUserSocket`; then register the 6 sub-handlers.
- `handlers/`: `message` (`chat:message/history/edit/unsend`), `room` (`chat:join/leave`), `typing-read`, `reaction`, `pin`, `group`. **No settings/e2ee handler exists.**
- `store/` (all in-memory `Map` — the DB swap point, keep signatures):
  - `message.store.ts` — `Map<conv, ChatMessage[]>`; `getHistory(conv,cursor,limit)`, `PAGE_SIZE=30`.
  - `group.store.ts` — `GroupRecord` + `groupsByUser` index; `isAdmin`, `toGroupDto`.
  - `pin.store.ts` — `Map<conv, PinnedMessageDTO[]>`.
  - `user-sockets.store.ts` — `activeUserSockets: Map<userId,Set<socketId>>` (multi-tab) + `lastSeenStore` (set to `Date.now()` when a user's **last** socket disconnects).
- `util/broadcast.ts` — **room model**:
  - `broadcast()` (messages, edits, unsends): DM → `nsp.to(user:<recipient>).to(user:<self>)`; group → `nsp.to(chat:<conv>)`.
  - `broadcastToConversation()` (reactions, pins): DM → both `user:<id>` rooms; group → `chat:<conv>`.
  - Every socket is always in `user:<selfId>` → DM delivery works even with the conversation closed. Group delivery needs an explicit `chat:join`.

**Offline replay does exist (DM only)**: `flushPendingMessages` — on a user's first reconnecting socket, replays every DM `ChatMessage` with `timestamp > lastSeen`, not deleted, not sent by them. Caveats: DM only (no group catch-up), and `lastSeen`/messages are in-memory so a server restart erases it.

History pagination (`getHistory`): cursor = `timestamp`; returns the 30-message slice *before* the cursor, `nextCursor` = oldest slice ts (or null), `hasMore` = slice didn't reach index 0. Client `useInfiniteQuery` walks backward.

Group rules (`group.handler.ts`): create requires **≥3 unique members** (`min_members`), name ≤60 chars; sole admin with >1 member can't leave (`must_transfer_admin`); leave/kick first emit a `system` ChatMessage (Vietnamese, e.g. `"<name> đã rời nhóm"`) while the leaver is still in-room, then mutate; `autoDeleteIfTooSmall` dissolves the group when `memberIds.length < 3` (reason `"dissolved"`); `group:delete`/dissolve calls `deleteConversationMessages` (history gone, no archive); `block-member` force-leaves the chat room, unblock rejoins; admin-only actions check `isAdmin`.

Pin (`pin.handler.ts`): `chat:pin` falls back to the client-sent snippet when the server message store was wiped by a restart (restart resilience); snippet ≤200 chars; dedupe by id; `unshift` (newest first). Reply (`util/reply.ts`): prefers the authoritative server message, falls back to client `replyTo`; snippet ≤140.

---

## 6. Flows (the patterns to preserve)

**Send**: `useChat.sendMessage` → `tempId` + `addOptimisticMessage` (status `pending`, renders instantly) → `emit("chat:message", dto, ack)` → server validates (group membership/mute) → assigns `id`+`timestamp` (no seq) → `addMessage` → `broadcast` to room (sender's other tabs included via `user:<self>`) → `ack(ChatMessageDTO)` → client `reconcileAck(tempId,server)` flips `tempId→id`, `pending→sent`. Peer `useMessages` `chat:message` listener dedupes by `id`, prepends to query cache.

**Read receipt**: peer emits `chat:read { conversationId, messageId }`. Server relays `chat:read { conversationId, userId, messageId }` to `user:<recipient>` (DM) or `chat:<conv>` (group), excluding self. **Wire identity is `messageId`** — the client maps that to its local `seq`/`readCursors` to flip ticks. No server-side read state is stored.

**Edit/unsend**: sender-only; edit also requires `type==="text"` and not deleted; unsend sets `deleted=true`, `content=""`. Both broadcast (`chat:edited`/`chat:unsent`); message kept (soft-delete) so replies/pins still resolve.

**Block** (`client lib/blockMarker.ts`): block/unblock sent as a `system` message `__chat_block_signal__:1|0`, parsed + filtered from UI, flips `blockedByUsers`.

---

## 7. Rebuilding with a real database

Handlers + room model are reusable as-is. Swap only the `store/` layer behind the existing exported function signatures (`getMessages`, `addMessage`, `findMessage`, `getHistory`, `deleteConversationMessages`, `eachConversation`, group/pin equivalents).

### Suggested schema (Postgres / Prisma flavored)

```
conversations ( id PK,                       -- "dm:a:b" | "group:uuid"
                 kind enum(dm,group), created_at, created_by )

conversation_members ( conversation_id FK, user_id,
                 role enum(member,admin),
                 is_muted bool, is_blocked bool,
                 PRIMARY KEY (conversation_id, user_id) )

messages ( id PK uuid, conversation_id FK,
           seq bigint,                        -- NEW: none exists today
           sender_id, sender_name,
           content text, type enum,
           reply_to_id FK messages NULL,
           created_at timestamptz,            -- = old `timestamp` cursor
           edited_at NULL, deleted bool,
           UNIQUE (conversation_id, seq) )

reactions ( message_id FK, user_id, user_name, emoji,
            PRIMARY KEY (message_id, user_id) )   -- one per user

pins ( conversation_id, message_id, pinned_by, pinned_by_name,
       pinned_at, content_snippet, type,
       PRIMARY KEY (conversation_id, message_id) )

conversation_settings ( conversation_id, scope_user_id NULL,  -- null = shared
       theme_id, emoji, e2ee bool, e2ee_pubkey )
nicknames ( conversation_id, target_user_id, nickname )

read_receipts ( conversation_id, user_id, up_to_seq,
       PRIMARY KEY (conversation_id, user_id) )
```

### Migration steps (in order)

1. **Introduce `seq`** — none exists today; ordering is implicit array order and read receipts use `messageId`. Add a gap-free monotonic per-conversation `seq`: insert inside a txn with `seq = (SELECT COALESCE(MAX(seq),0)+1 FROM messages WHERE conversation_id=$1)` (or a per-conversation sequence / advisory lock). Then move read receipts to `up_to_seq` so unread is computable server-side and survives reconnect — this lets `chatRoomUnread` stop being localStorage-only.
2. **Replace `message.store.ts`** keeping signatures. `getHistory(conv,cursor,limit)` → `WHERE conversation_id=$1 AND created_at < $cursor ORDER BY created_at DESC LIMIT $limit+1`, reverse, derive `hasMore`/`nextCursor`. Index `(conversation_id, created_at DESC)` and `(conversation_id, seq)`.
3. **Reactions** — replace the in-memory "drop prev, push new" with `INSERT ... ON CONFLICT (message_id,user_id) DO UPDATE` (or `DELETE` when `emoji===null`). Broadcast unchanged. Keep `messageOwnerId` in `ReactionBroadcastDTO` (the unread/sort feature depends on it).
4. **Pins / groups / settings** — table swaps behind `pin.store`/`group.store`. Group delete/dissolve cascades members + messages (or soft-archive instead of `deleteConversationMessages`). **Add a real settings handler** (`settings:get/set*`, broadcast `settings:*Changed`) — the client already speaks this protocol; the server just never implemented it, so today settings don't sync.
5. **Auth** — replace the trust-the-handshake middleware with real verification (validate a session token / JWT in `socket.handshake.auth`), since every handler trusts `socket.data.user.id`.
6. **Durable offline delivery** — `flushPendingMessages` already replays missed **DM** messages via in-memory `lastSeen`; back it with `read_receipts.up_to_seq` (per conversation, includes groups) so the catch-up is correct, covers groups, and survives restarts.
7. **History/pins replay on join** — `chat:join`/`chat:pins-fetch` should hydrate from DB so a fresh or previously-closed client gets server truth (client already forces this via `staleTime:0`+`refetchOnMount:"always"` in `useMessage`).

### Properties to preserve

Optimistic send + `tempId→id` reconcile · dedupe inbound by `id` (events double-fire on reconnect) · soft-delete only (replies/pins reference messages) · DM = both `user:<id>` rooms (delivery with conversation closed), groups need explicit join · client/server DTO field names byte-aligned · group system messages emitted *before* membership mutation.

### Known debt to fix in the rebuild

Unverified handshake auth (impersonation) · in-memory loss on restart · settings/E2EE never reach the server (no sync, E2EE is a no-op skeleton) · hardcoded `http://localhost:3002` (`client src/socket/client/manager.ts`) · media upload is a stub + 1 MB `maxHttpBufferSize` · only 6 fixed reactions · offline replay is DM-only & volatile · no causal ordering across concurrent edits/reactions · group history hard-deleted on dissolve.

---

## 8. When editing chat in the current codebase

- Touch a socket event? Update **both** `dto/chat.dto.ts` files; `tsx watch` reloads the server but a TS error blocks the reload — a missing emitted field makes client guards silently `return`.
- New unread trigger? Go through `chatRoomUnread.store.markUnread`, keyed the way the dropdown reads it (DM = other user id, group = conversationId).
- New inbound socket event? Add the listener in `useMessage`'s effect + matching `off()`; dedupe by `id`.
- Adding settings sync? You must build the server handler — it does not exist yet.
- `npx tsc --noEmit` clean on **both** projects before done.

---

## 9. `/presence` namespace — a hard dependency of chat

A standalone chat BE is **not** enough: ~15 chat files + `useGlobalChatUnread` + `ChatDropdownContent` read `usePresenceStore`. Without `/presence` the sidebar/contact list is empty, no DM rooms get joined, unread never fires. Rebuild it alongside chat.

`social-socket-server/src/feature/presence/` — same `authMiddleware`, in-memory `Map<userId, OnlineUserDTO>`.

- `OnlineUserDTO = User = { id: string; name: string; avatar?: string }`.
- On connect: `socket.broadcast.emit("presence:user-joined", onlineUser)` (to everyone else).
- Client → server: `presence:get-online-users` → `ack(OnlineUserDTO[])` (full snapshot; client calls this on connect).
- On disconnect: `nsp.emit("presence:user-left", userId)` (to all).
- `presence:online-users` is declared in the DTO but the handler never emits it — snapshot is delivered only via the `get-online-users` ack.
- Per-user dedupe is by `userId` (last socket wins in the map); no multi-tab refcount here (unlike chat's `user-sockets.store`), so a second tab closing emits `user-left` even if another tab is open. Fix in rebuild if it matters.

`/notification` and `/report` namespaces also exist but chat does not depend on them.

---

## 10. Exact wire contract (drop-in BE reference)

Field shapes from `social-socket-server/.../dto/chat.dto.ts`. The comment in that file is the rule: *backend changes a field → update only the dto + client mapper; components never know.*

**`tempId` is never on the wire from the server.** Server `SendMessageDTO` = `{ conversationId, content, type?, replyTo? }` — no tempId. Server assigns `id`, acks a full `ChatMessageDTO` (no tempId), broadcasts the same to peers. The client carries its own `tempId` in a closure and reconciles via the **ack callback correlation**; peers dedupe by `id`. A rebuilt BE must NOT expect or echo `tempId` (group create is the exception: `CreateGroupDTO` does carry a client `tempId`, still not echoed — ack returns `{ ok, conversationId?, error? }`).

`ChatMessageDTO` carries optional `error?: string`: group-send rejection acks a message-shaped object with `error` set (`not_member` / `muted`) and empty `id` — client branches on `error`.

Key shapes:

```
ChatMessageDTO   { id, conversationId, senderId, senderName, content,
                   timestamp, type:"text|image|file|video|system",
                   replyTo?, editedAt?, deleted?, reactions?, error? }
ReplyContextDTO  { id, senderId, senderName, content, type:"text|image|file|video" }
MessageReactionDTO { userId, userName, emoji:ReactionKey }   // 6 keys: like love haha wow sad angry
ChatHistoryRequestDTO  { conversationId, cursor?:number, limit?:number }   // cursor = ts, older-than
ChatHistoryResponseDTO { messages:ChatMessageDTO[], nextCursor:number|null, hasMore }
ReadReceiptDTO   { conversationId, userId, messageId }       // wire identity = messageId, NOT seq
TypingEventDTO   { conversationId, userId, userName, isTyping }
MessageEditedDTO { conversationId, messageId, content, editedAt }
MessageUnsentDTO { conversationId, messageId }
GroupCreatedDTO/GroupUpdatedDTO { conversationId, name, memberIds[], adminIds[],
                   mutedMembers[], blockedMembers[], createdAt, createdBy }
GroupDeletedDTO  { conversationId, reason?:"left|kicked|deleted|dissolved" }
PinnedMessageDTO { id, conversationId, content, type, senderId, senderName,
                   pinnedAt, pinnedBy, pinnedByName }
PinRequestDTO    { conversationId, messageId, content?, type?, senderId?, senderName? }  // ?=restart fallback
ReactMessageDTO  { conversationId, messageId, emoji:ReactionKey|null }   // null = remove
ReactionBroadcastDTO { conversationId, messageId, messageOwnerId, userId, userName, emoji|null }
```

**Ack error strings the client may branch on** (must reproduce exactly):

| Event | error values |
|---|---|
| `chat:message` (group) | `not_member`, `muted` (returned inside a `ChatMessageDTO` with `error`) |
| `chat:edit` | `forbidden`, `deleted`, `non_editable` |
| `chat:unsend` | `forbidden` |
| `chat:react` | `invalid_emoji`, `not_found` |
| `chat:pin` | `not_found` |
| `group:create` | `min_members`, `name_too_long` |
| `group:leave` | `not_found`, `not_member`, `must_transfer_admin` |
| `group:kick` | `not_found`, `forbidden`, `cannot_kick_self`, `not_member` |
| `group:promote`/`mute-member`/`block-member` | `not_found`, `forbidden`, `not_member` |
| `group:delete` | `not_found`, `forbidden` |

Ack envelopes: `{ ok, error? }` (edit/unsend/react/pin/group actions), `CreateGroupAck { ok, conversationId?, error? }`, `chat:message` → full `ChatMessageDTO`, `chat:history` → `ChatHistoryResponseDTO`, `chat:pins-fetch` → `PinnedReplayDTO`.

With §9 + §10 + the schema in §7, the BE is buildable standalone.

---

## 11. Auth — what you must implement (currently 100% stubbed)

Today **there is no authentication anywhere**. The chain end-to-end:

- `src/feature/auth/services/auth.service.ts` — `login`/`register` are fakes: `setTimeout(800)` then return `{ userId: "user_<username>", username, token: "fake-jwt-token" }`. Explicit `TODO: replace with real API call`. No server, no password check, no hashing.
- `src/feature/auth/dto/auth.dto.ts` — `LoginRequestDTO {username,password}`, `LoginResponseDTO { status, message, data?: { userId, username, token } }` (and Register variants). The response *shape already has `token`*.
- `src/feature/auth/stores/auth.store.ts` — `useAuthStore` (zustand `persist`, localStorage key `auth-state`) stores **only `userId`, `userName`, `isLoggined`**. `saveLoginnedUser` **discards `token`** — it is never persisted or used.
- `src/socket/client/manager.ts` — `getNamespaceSocket(nsp, auth)` → `manager.socket(nsp, { auth })`. Chat (`getChatSocket()`) passes `{ userId, userName }` only — **no token on the handshake**.
- `social-socket-server/src/socket/middleware/auth.ts` + `auth.schema.ts` — zod-validates `socket.handshake.auth = { userId, userName?, avatar? }` and trusts it verbatim. **Anyone can connect as any `userId`.** Applied per-namespace to all 4 namespaces (`chat/presence/notification/report`).

So every server handler's `socket.data.user.id` is attacker-controlled. Fixing this is prerequisite to any production use.

### The auth process to build (requirements)

**1. HTTP auth API** (new — there is no backend for this; could live in the socket-server repo, a Next.js route handler, or a separate service):

- `POST /auth/register` — validate, **hash password** (argon2id or bcrypt cost ≥12), insert user, return access token (+ refresh).
- `POST /auth/login` — look up by username/email, `verify(password, hash)` (constant-time), issue tokens. Generic error on failure (no "user not found" vs "bad password"). Rate-limit by IP + account.
- `POST /auth/refresh` — exchange a valid refresh token for a new access token; rotate the refresh token.
- `POST /auth/logout` — revoke the refresh token (and clear cookie).
- **Access token = signed JWT**, short TTL (~15 min), claims `{ sub: userId, name, iat, exp }`, HS256 (shared secret) or RS256 (keypair). Refresh token = opaque random, stored hashed server-side with expiry, long TTL (~7–30 d), single-use (rotate on refresh).

**2. User schema** (add to §7):

```
users ( id PK uuid, username citext UNIQUE, email citext UNIQUE,
        display_name, password_hash, avatar_url NULL,
        created_at, disabled bool )
refresh_tokens ( id PK, user_id FK, token_hash, expires_at,
        revoked_at NULL, created_at )   -- enables logout / rotation / revoke-all
```

`socket.data.user.id` must equal `users.id`. Conversation ids (`dm:<a>:<b>`) and every `senderId`/`memberId`/`adminId` reference it.

**3. Client wiring (exact edits):**

- `auth.service.ts` — replace fakes with real `fetch` to the API. On success keep `token` (and refresh).
- `auth.store.ts` — extend `AuthState` + `saveLoginnedUser` to store the access token (and expiry); add a setter for refreshed tokens. **Prefer an httpOnly+Secure+SameSite cookie for the refresh token** (XSS-safe); keep the access token in memory or short-lived store. localStorage for long-lived tokens = XSS-exfiltratable — avoid for the refresh token.
- `manager.ts` / `getChatSocket()` — put the **access token** on the handshake: `{ auth: { token } }`. Stop sending raw `userId`/`userName` (server derives them from the verified token). On `connect_error` with reason `AUTH_REQUIRED`/expired: refresh the token, then `socket.auth = { token: fresh }; socket.connect()`. Socket.IO re-sends `auth` on every (re)connect, so a fresh token must be set before reconnect.
- Handle mid-session expiry: server may disconnect when the token expires; client refreshes and reconnects. Chat already re-joins rooms / flushes pending on reconnect (§5), so re-auth slots into the existing reconnect path.

**4. Server wiring (exact edits):**

- `auth.schema.ts` — change to `{ token: z.string().min(1) }`.
- `auth.middleware.ts` — `verify(token, secret)`; on fail `next(new Error("AUTH_REQUIRED"))`; on success load/derive the user and set `socket.data.user = { id: claims.sub, name: claims.name, avatar }`. Reject disabled users. Keep it applied to **all 4 namespaces** (the `io.use` caveat in §1 still holds — per-namespace `.use`).
- Optional: enforce expiry mid-connection — on each event or a timer, check `claims.exp`; if passed, `socket.disconnect(true)` so the client must re-handshake with a fresh token.
- Handlers need **no change**: they already trust `socket.data.user.id` and enforce resource authorization (group `isAdmin`, sender-only edit/unsend). Authentication makes that trust sound; keep the authorization checks.

**5. Hardening checklist** (do all):

- Passwords hashed (argon2id/bcrypt), never logged. Note: `setup.ts` `onAny` logs every payload — ensure auth payloads/tokens never flow through a logged socket event.
- Signed short-TTL access token + rotating, server-stored, revocable refresh token.
- Lock down CORS: `setup.ts` is `origin:"*"` → restrict to the client origin; combine with token auth (don't rely on CORS for auth).
- TLS in prod (`wss://`), and replace the hardcoded `http://localhost:3002` in `manager.ts` with an env var.
- Rate-limit `login`/`register`/`refresh`; lockout/backoff on repeated failures.
- Generic auth errors (no account-existence oracle). Validate/normalize username+email (citext/unique).
- Never trust client-sent identity for anything: derive `userId` from the verified token only — drop the old `userId`/`userName` handshake fields entirely.
- On logout / password change / "log out all devices": revoke refresh tokens; consider a token version/`jti` deny-list so existing access tokens die fast.

This is enough to implement auth end-to-end from this skill alone. Auth is **authentication only** — the chat/group resource authorization already exists in the handlers and stays.
