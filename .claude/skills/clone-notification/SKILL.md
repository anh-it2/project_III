---
name: clone-notification
description: Architecture + rebuild guide for this project's realtime notification feature (Next.js client + Socket.IO server). Use when working on notifications, the bell badge, notification toasts, mark-read, mention/like/comment/share/follow alerts, OR when rebuilding notifications from scratch / migrating the in-memory backend to a real database. Triggers on "notification feature", "rebuild notifications", "persist notifications", "notification DB", "/clone-notification".
---

# clone-notification — Realtime notifications: how it works + how to rebuild it

Verified against `social-platform/src/feature/notification/` and `social-socket-server/src/feature/notification/` (both read in full). Where the client *assumes* something the server does not provide, it is called out — those gaps matter for the rebuild. Sister skill: `clone-chat` (same server, same auth, same room model — read it for shared infra detail).

Two codebases, side by side:

- **Client**: `social-platform/` — Next.js 16 + React 19, Zustand, Socket.IO client. Notifications under `src/feature/notification/`; UI under `src/shared/components/topnav/`.
- **Server**: `social-socket-server/` — Node + Socket.IO, `tsx watch src/index.ts` (hot-reloads on save), port `3002`. Notifications under `src/feature/notification/`. **In-memory only — server restart = all notifications + read state + `firstUserId` lost.** Plain files, not a git repo.

`/notification` Socket.IO namespace carries everything. No REST. One namespace among four (`/chat`, `/presence`, `/notification`, `/report`) on the same `socket.io` server.

---

## 1. Server bootstrap & auth (`src/index.ts`, `src/socket/`)

- `setup.ts`: one `socket.io` Server. `io.of("/notification")` → `notificationNsp.use(authMiddleware)` (per-namespace; `io.use` only covers root `/`). CORS `origin:"*"`, `maxHttpBufferSize: 1e6`, ping 25s / timeout 20s, `onAny` logs every inbound event. On connect: `logEvents` → `registerNotificationHandler(nsp, socket)` → log disconnect reason. **No disconnect cleanup** — a user's notification list stays in memory after they leave.
- **Auth is an unverified handshake** (`auth.schema.ts`): zod-validates `socket.handshake.auth` = `{ userId: string(min 1), userName?: string, avatar? }`, then `socket.data.user = { id, name ?? "Anonymous", avatar }`. **No token, no signature — any client can claim any `userId`, therefore can read/mark anyone's notifications and forge the `actorId` on emits.** Same single biggest security debt as chat; fix in the rebuild.

---

## 2. Core data model

Server `Notification` (`social-socket-server/.../type.ts`) and client `Notification` (`client types.ts`) and `NotificationDTO` (both `dto/notification.dto.ts`) are **byte-identical** — no mapping divergence. `notification.mapper.ts` (client) is a field-for-field copy (`toNotification`/`toNotifications`); it exists only as a seam.

| Field | Meaning |
|---|---|
| `id` | server `randomUUID()`, assigned on accept |
| `recipientId` | who receives it (the room key: `user:{recipientId}`) |
| `actorId` / `actorName` | who triggered it; taken from `socket.data.user`, **not** from the payload |
| `kind` | `like \| comment \| share \| follow \| mention` (TS union only — **not enforced server-side**) |
| `postId?` | optional deep-link target (UI does not route on it today) |
| `preview?` | optional snippet (e.g. comment text, mention context) |
| `read` | bool; server-owned, in-memory |
| `timestamp` | server `Date.now()` ms; list order is array order (newest `unshift`ed first), **no cursor/pagination** |

Client → server payload is the narrower **`EmitNotificationDTO`** = `{ recipientId, kind, postId?, preview? }`. Server fills `id`, `actorId`, `actorName`, `read:false`, `timestamp`. **There is no `seq`, no grouping/coalescing** ("X and 3 others liked…" does not exist — every action is one row).

---

## 3. Client state (Zustand) & UI

- **`stores/notification.store.ts`** — **NOT persisted** (no `persist`, unlike `chat.store`). On reload the list is empty until the socket reconnects and `notification:list` refills it; read state therefore lives only on the server. Shape: `notifications: Notification[]`; methods `setAll`, `addOne` (dedupes by `id`, prepends), `markRead(id)`, `markAllRead`, `unreadCount()`.
- **Badge** (`NotificationNavBtn.tsx`): subscribes via a selector `s => s.notifications.filter(n => !n.read).length` — it does **not** call the store's `unreadCount()` (that method is not a reactive subscription; don't swap it in expecting re-renders). Renders an antd `<Badge count>` over the bell; click toggles `NotificationDropdownContent`; closes on outside-click / Escape.
- **Shared visual — `src/shared/components/notification/NotificationItemContent.tsx`**: the single notification card (hash gradient avatar via `actorGradient(actorId)`, kind icon+color badge from `NOTIFICATION_ICON`/`NOTIFICATION_ICON_COLOR`, bold `actorName` + `notificationText(t,kind,preview)` + `relativeTime`, unread font weight). **Every surface that renders a `Notification` must use this component — do not re-implement the row.** It owns its own `useTranslations`; callers pass only `notification`. clone-style compliant (Tailwind for static layout/size, CSS vars for theme color, inline only for runtime gradient + kind color).
- **Dropdown** (`shared/components/topnav/notification-dropdown/`): `DropdownTabs` all/unread/read filter; `NotificationDropdownItem` is now just the clickable row chrome (`chat-dd-item` hover, padding, onClick) + trailing unread dot — its body is `<NotificationItemContent>`. Header "mark all read", footer "see all" (**no-op — no notifications page exists**).
- Presentation helpers + i18n: `src/shared/data/notifications.ts`; messages under `Notification.template` / `Notification.time`, labels under `Topnav.notifications` in `message/{en,vi}.json`.

---

## 4. Socket connection lifecycle

`socket.ts`: `getNotificationSocket()` reads `{ userId, userName }` from `useAuthStore` and calls `getNamespaceSocket("/notification", …)`. `initNotification()` / `disposeNotification()` are an idempotency guard called from `src/socket/client/provider.tsx` on login/logout. Server URL is hardcoded `http://localhost:3002` (`src/socket/client/manager.ts`) — same hardcode as chat.

---

## 5. Socket event catalog (`/notification`)

Client `dto/notification.dto.ts` mirrors `social-socket-server/.../dto/notification.dto.ts`. **Keep field names byte-aligned** — a field present one side but not emitted the other silently fails (same class of bug as chat's `messageOwnerId`).

**Client → server** (all take an ack):

- `notification:first-user` `(ack:{userId})` — demo helper (see §7)
- `notification:list` `(ack:{notifications})` — returns the full per-user array (≤50, no pagination)
- `notification:emit` `(EmitNotificationDTO, ack:{ok,error?})` — create + fan-out
- `notification:read` `({notificationId}, ack:{ok})` — mark one
- `notification:read-all` `(ack:{ok})` — mark all

**Server → client** (push):

- `notification:new` `(NotificationDTO)` — a new notification for this user
- `notification:read-update` `(notificationId)` — one was marked read (sync other tabs)
- `notification:read-all-update` `()` — all marked read (sync other tabs)

There are **no** client-only ghost events here (contrast chat's `settings:*`). Everything the client emits has a server listener.

---

## 6. Server architecture & flows (`social-socket-server/src/feature/notification/notification.handler.ts`)

One file, one in-memory store — the DB swap point. Keep the helper signatures.

- `notificationStore = new Map<userId, Notification[]>()`; `MAX_PER_USER = 50`. Helpers: `getList` (lazy-init), `pushNotification` (`unshift` + trim tail to 50), `markRead` (returns `false` if missing **or already read** → suppresses redundant broadcast), `markAllRead`, `toDTO` (`{...n}` identity).
- `registerNotificationHandler`: `socket.join("user:"+user.id)`; capture `firstUserId` if unset; register the 5 listeners.

**Emit flow** (the pattern to preserve): caller → `notification:emit { recipientId, kind, postId?, preview? }` → server **rejects** missing `recipientId` (`{ok:false,error:"missing_recipient"}`) and **silently no-ops self-notify** (`recipientId === user.id` → `{ok:true}`, nothing stored) → build `Notification` (server-owned `id`/`actorId`/`actorName`/`timestamp`/`read:false`) → `pushNotification(recipientId,…)` (**stored even if recipient offline**) → `nsp.to("user:{recipientId}").emit("notification:new", dto)` → `ack({ok:true})`. Recipient's `useNotifications` `notification:new` listener → `addOne` (dedupe by `id`) → antd toast **only if `initialFetchedRef` is true** (suppresses a toast storm for history replayed by the initial `notification:list`). The toast renders `{ key: n.id, title: <NotificationItemContent notification={n} /> }` — same component as the dropdown row, so toast and list never drift. **Use antd's `title` prop, not `message` (deprecated in this antd version — emits a console warning).**

**Offline behaviour** — there is **no `flushPendingMessages` equivalent** (chat has one; notifications do not need one): emits are stored in the recipient list at emit time regardless of online status, and on every (re)connect the client re-issues `notification:list` and `setAll`s the full array. So missed notifications *are* delivered on reconnect — **as long as the server has not restarted** (in-memory, ≤50, no age eviction).

**Read flow**: client `readOne`/`readAll` mutate the Zustand store **optimistically first**, then emit. Server `markRead`/`markAllRead`, then broadcasts `read-update`/`read-all-update` back to `user:{self}` — this is purely a **multi-tab sync** mechanism (the originating tab already updated optimistically; `markRead` is idempotent so the echo is harmless). `read` state is server-memory only — **no persistence, lost on restart**.

**Two emit entry points on the client** — don't conflate:
- `lib/emit.ts` `emitNotification(data)` — fire-and-forget, reads `useAuthStore` directly, no-ops if logged-out / disconnected / self. **This is what feature code calls** (feed/profile/reels likes-comments-shares; `mention/lib/notify.ts` `notifyMentions`). It does not need the hook mounted.
- `useNotifications().emit` — same wire call but gated on the hook's `isConnected`; rarely used directly.

`useNotifications()` must be mounted exactly once (it lives in `NotificationNavBtn`) — it owns connect/reconnect fetch, the push listeners, the toast, and exposes `emit/readOne/readAll`.

---

## 7. `firstUserId` demo mechanism

Mock posts have no real owner, so reactions need a target. Server captures the **first userId that ever connects** into a process-global `firstUserId` (logged, survives until restart). `notification:first-user` returns it. Client `useNotifications` fetches it on connect and caches it via `src/shared/lib/firstUser.ts` (module var + `sessionStorage`, sync-readable by emit handlers). Feature code sets `recipientId = getFirstUserId()` so cross-browser testing routes every reaction to one consistent inbox without a DB. **Pure demo scaffolding — delete it once posts have real `authorId`s** (replace every `getFirstUserId()` call site with the post's real owner id).

---

## 8. Rebuilding with a real database

The handler + room model are reusable as-is. Swap only the in-memory `Map` behind the existing helpers (`getList`→list/paginate, `pushNotification`→insert, `markRead`, `markAllRead`, `toDTO`). Keep the socket protocol identical so the client needs zero changes (except deleting the `firstUser` scaffolding).

### Suggested schema (Postgres / Prisma flavored)

```
notifications ( id PK uuid,
                 recipient_id   text,            -- index
                 actor_id       text,
                 actor_name     text,            -- denormalized for now; or join users
                 kind           enum(like,comment,share,follow,mention),
                 post_id        text NULL,
                 preview        text NULL,
                 read           bool default false,
                 created_at     timestamptz,     -- = old `timestamp`, the cursor
                 INDEX (recipient_id, created_at DESC),
                 INDEX (recipient_id, read) )
```

Optional next step: a `notification_counters(recipient_id PK, unread_count)` row maintained in the same txn so the badge doesn't scan rows. Coalescing ("X and 3 others") would add a `group_key` (e.g. `kind:postId`) + `actor_ids[]` — **net-new behaviour, not a like-for-like migration.**

### Migration steps (in order)

1. **Replace the store, keep signatures.** `getList(userId)` → `SELECT … WHERE recipient_id=$1 ORDER BY created_at DESC LIMIT 50` (then add a `before`-cursor param to make the dropdown infinite — none exists today). `pushNotification` → `INSERT`. `markRead` → `UPDATE … WHERE id=$1 AND recipient_id=$2 AND read=false` and **use the affected-row count as the `changed` boolean** so the broadcast stays conditional. `markAllRead` → `UPDATE … WHERE recipient_id=$1 AND read=false`. Persistence alone removes the biggest gap (restart no longer wipes inbox + read state).
2. **Auth** — replace the trust-the-handshake middleware with real verification (session/JWT in `socket.handshake.auth`); every handler trusts `socket.data.user.id` for both reading lists and forging `actorId`.
3. **Validate `emit`** — enforce `kind` against the enum, bound `preview` length, verify `postId` exists and that `actorId` may notify `recipientId` (block/privacy). Add per-socket rate limiting (none today — an authed client can spam unlimited `notification:emit`).
4. **Delete the `firstUserId` scaffolding** — once posts carry a real `authorId`, route notifications to it; drop `notification:first-user`, `src/shared/lib/firstUser.ts`, and the `getFirstUserId()` call sites.
5. **Server-derived unread + history** — return an `unreadCount` (and paginate `notification:list`) so the badge and dropdown survive restart and don't depend on shipping the whole array. The client store is already non-persisted, so it will simply reflect server truth.
6. **Optional**: a notifications page (wire the dropdown footer "see all"); read receipts / TTL / age eviction policy; collapse `actor_name` denormalization into a users join.

### Properties to preserve

Self-notify no-ops silently (client `emit.ts` **and** server both guard — keep both) · `addOne` dedupes by `id` (push can race the initial list) · toast suppressed until `initialFetchedRef` flips (don't toast replayed history) · read is optimistic client-side then echoed to `user:{self}` for multi-tab sync (`markRead` idempotent — keep it so) · server owns `id`/`actorId`/`actorName`/`timestamp` (never trust the payload) · client/server DTO field names byte-aligned.

### Known debt to fix in the rebuild

Unverified handshake auth (impersonation + read anyone's inbox + forge `actorId`) · in-memory loss on restart (notifications **and** read state) · no `kind`/`preview`/`postId` validation or sanitization · no rate limiting on `emit` · no pagination (hard cap 50, silently drops older) · no coalescing/grouping · `postId` carried but UI never deep-links · dropdown "see all" is a dead link · `firstUserId` demo hack still wired · hardcoded `http://localhost:3002`.

---

## 9. When editing notifications in the current codebase

- Touch a socket event? Update **both** `dto/notification.dto.ts` files; `tsx watch` reloads the server but a TS error blocks the reload — a missing emitted field makes client guards silently `return`.
- Adding a new `kind`? It flows through five places: the `NotificationKind` union (both DTOs), `NOTIFICATION_ICON`, `NOTIFICATION_ICON_COLOR`, `notificationText` switch, and `Notification.template` in `message/{en,vi}.json`. Miss one → missing icon/label or untranslated text. The visual itself needs **no** change — `NotificationItemContent` renders any kind from those tables.
- Rendering a notification anywhere new (page, panel, another toast)? Reuse `NotificationItemContent` — never hand-roll avatar/icon/text. Surface-specific chrome (click row, unread dot, toast frame) stays in the caller. Counter-example: `feature/admin/hooks/useReports.tsx` toast is a **different domain** (`ReportDTO`, not `Notification`) — it intentionally does *not* use this component; don't try to force it.
- New emit trigger from feature code? Call `emitNotification` from `lib/emit.ts` (not the hook); it self-guards logged-out/offline/self. Today `recipientId` is usually `getFirstUserId()` — that is the demo scaffold.
- New inbound server→client event? Add the listener + matching `off()` in `useNotifications`' push effect; dedupe by `id` (events double-fire on reconnect).
- Badge not updating? It uses a store **selector**, not `unreadCount()` — keep new unread paths going through `addOne`/`markRead` so the selector recomputes.
- `npx tsc --noEmit` clean on **both** projects before done.
