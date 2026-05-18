---
name: clone-api
description: How this project binds the Next.js frontend to the social-platform-be REST API — the layered Browser → hook → service → Next route handler → server proxy → Express BE flow, httpOnly-cookie JWT auth, DTO/mapper conventions, and the Express module pattern. Use when adding or editing any API-backed feature (a new endpoint, wiring a form/page to the BE, auth-protected calls, persisting something currently in localStorage/mock). Triggers on "bind API", "call backend", "add endpoint", "wire to BE", "create route handler", "persist to DB", "proxy", "/clone-api".
---

# clone-api — How the frontend binds to the REST backend

Verified against the live auth (`src/feature/auth/`) + profile (`src/feature/profile/`) implementations and `../social-platform-be/src` (read in full). Follow this exactly when adding or editing any HTTP-backed feature. Realtime fan-out is a **separate** concern — see `clone-chat` / `clone-notification` for the socket side.

## Two backends, three tiers

- **`social-platform-be/`** — Express + Prisma + Postgres REST API. Sibling repo at `../social-platform-be` (NOT in this git repo; plain files). Port `8080`, everything mounted under `/api/v1`. `tsx watch src/server.ts` (hot-reload). Response envelope is always `{ success: boolean, data?: T, message?: string }`.
- **Next BFF layer** (`src/app/api/**/route.ts` + `src/feature/<x>/server/<x>Proxy.ts`) — same-origin route handlers that proxy the BE. **The only tier that talks to the BE and the only tier that touches the JWT.**
- **Browser** — components → hooks → client services. Talks **only** to same-origin `/api/*`, never the BE directly, never sees the token.

```
Component
  → hook            (TanStack Query: useQuery / useMutation)   src/feature/<x>/hooks/
  → client service  (axios apiClient, relative "/api/<x>")      src/feature/<x>/services/<verb>.service.ts
  → Next route       export GET/POST/PATCH(req: NextRequest)    src/app/api/<x>/route.ts
  → server proxy     reads httpOnly cookie, axios → BE          src/feature/<x>/server/<x>Proxy.ts
  → social-platform-be   routes → controller → service → model(prisma) → zod
  → envelope { success, data } back up; proxy unwraps to a clean browser shape
```

Live reference implementations to copy from:
- **Unauthenticated POST + sets cookie**: auth login/register — `src/app/api/auth/login/route.ts`, `src/feature/auth/server/authProxy.ts` (`forwardAuth`).
- **Authenticated GET + PATCH**: profile — `src/app/api/profile/route.ts`, `src/feature/profile/server/profileProxy.ts`.

## Auth model — JWT in an httpOnly cookie

- BE issues a JWT (`{ sub, email }`, `jwtExpiresIn` default `1d`). The browser **never** holds it.
- `forwardAuth` (auth proxy) POSTs credentials to the BE, then **strips `data.token` into an httpOnly cookie** named `token` (`AUTH_COOKIE`, exported from `authProxy.ts`) and returns only `{ user }` to the browser. Cookie: `httpOnly`, `secure` in prod, `sameSite:"lax"`, `path:"/"`, `maxAge` synced to token TTL.
- Every authenticated proxy reads `req.cookies.get(AUTH_COOKIE)?.value`; missing → `401` immediately; present → forward as `Authorization: Bearer <token>` to the BE.
- Session bootstrap: `GET /api/auth/me` → `fetchMe` validates the cookie against BE `GET /users/me`; a BE `401` clears the stale cookie. `useSessionBootstrap` rehydrates the Zustand `auth-state` from the cookie when the persisted store is empty.
- Client `auth-state` store persists **only** `userId/userName/email/isLoggined` for per-account `scopedKey` — never the token.

## Client transport — `src/shared/lib/apiClient.ts`

One axios instance for the whole browser side. `withCredentials: true` (cookie flows on every call). A response interceptor flattens any failure into `new Error(beHumanMessage)` so callers / TanStack Query always get `error.message` usable for a toast. **Always import this; never `axios.create` again in a service, never `fetch` from a component.**

## Conventions (these are hard rules in this repo)

1. **One task per service file.** `src/feature/<x>/services/getProfile.service.ts`, `updateProfile.service.ts` — not a barrel with many functions. Name the export `<verb><Thing>Service` (e.g. `getProfileService`, `meService`, `loginService`).
2. **Server proxy uses `axios`, not `fetch`.** `axios.request({ baseURL, url, method, headers, data })`, default `validateStatus` (throws on ≥400); in `catch`, `axios.isAxiosError(err) && err.response` → relay `err.response.status` + `data.message`; else `502 "Cannot reach … server"`.
3. **`const`, never `let`.** Structure proxies so the response binds once (early-return on each failure branch).
4. **DTO + mapper split.** `src/feature/<x>/dto/<x>.dto.ts` = wire shapes (request/response/error). Wire field names match the form/zod model 1:1 where possible so no translation is needed. `src/feature/<x>/dto/<x>.mapper.ts` only when the domain model differs from the wire shape (see `auth.mapper.ts`). Proxy unwraps the BE envelope and returns a clean `{ <thing> }` JSON body to the browser (e.g. `{ user }`, `{ profile }`).
5. **`API_BASE_URL`** = `process.env.API_BASE_URL ?? "http://localhost:8080/api/v1"`. Declared locally in each proxy module (no shared import for a plain string). Set real value in `.env.local`.
6. **Hooks own caching.** `useQuery` for reads (stable `queryKey` like `["profile","me"]`, `enabled: isLoggined`, `retry:false`, `refetchOnWindowFocus:false`); `useMutation` for writes, `onSuccess` → `queryClient.setQueryData(key, saved)`. A hook exposing `{ data, hydrated, save }` to many consumers dedupes through the shared query automatically — keep the return shape stable when replacing localStorage/mock with the API so callers don't change.
7. **Persist-then-announce.** When a write also has a realtime side effect: `await save()` first; **only on success** emit the socket event + navigate; on throw, `message.error(err.message)` and abort. The DB is the source of truth; the broadcast is best-effort.

## social-platform-be module pattern

Each feature = a folder under `src/modules/<name>/` with these files. Mounted in `src/routes/index.ts` (`router.use('/<plural>', <name>Routes)`).

| File | Responsibility |
|---|---|
| `<name>.routes.ts` | `Router()`. `router.<verb>(path, [requireAuth,] [validateBody(schema),] catchAsync(controller.fn))`. **Static segments before `/:id`** (e.g. `/me/profile` before `/:id`) or Express swallows them as the param. |
| `<name>.controller.ts` | Thin. Reads `req.user!.sub` (set by `requireAuth`) / `req.params` / `req.body`, calls the service, `res.json({ success: true, data })` (or `.status(201)`). No logic. |
| `<name>.service.ts` | Business logic. Throws `ApiError.notFound/...` for operational errors. Returns plain DTO objects. |
| `<name>.model.ts` | Prisma data access (`<thing>Store` object of async methods) + record/DTO types + `to<Public>` mappers. Multi-table writes that must be all-or-nothing go in one `prisma.$transaction([...])`. |
| `<name>.validation.ts` | zod schemas + inferred `Input` types. Mirror the frontend zod schema 1:1 for form payloads. |

Shared infra (don't reinvent): `requireAuth` (`middleware/auth.middleware.ts`, verifies Bearer → `req.user`), `validateBody(schema)` (`middleware/validate.middleware.ts`, replaces `req.body` with parsed), `catchAsync` (`utils/catch-async.ts`, forwards rejects to error mw), `ApiError` (`utils/api-error.ts`, `.badRequest/unauthorized/forbidden/notFound/conflict`), `prisma` (`config/prisma.ts`, single client), `env` (`config/env.ts`).

Prisma schema: prefer scalar columns `@default("")` so reads never 404 on a missing optional row; new model 1-1 with User → `userId @id` + `@relation(... onDelete: Cascade)` + back-relation field on `User`. Migrate with `npx prisma migrate dev --name <change>` run from `../social-platform-be` (loads its `.env` for `DATABASE_URL`; also regenerates the client).

## Recipe — add a new authenticated endpoint end to end

BE (`../social-platform-be`):
1. (If new persisted shape) edit `prisma/schema.prisma`; `cd ../social-platform-be && npx prisma migrate dev --name <change>`.
2. `<name>.validation.ts`: add zod schema mirroring the FE form schema; export inferred `Input`.
3. `<name>.model.ts`: add store method(s); use `$transaction` for atomic multi-row writes; add DTO type + mapper.
4. `<name>.service.ts`: add method — fetch/guard (`ApiError`), return DTO.
5. `<name>.controller.ts`: add thin handler → `res.json({ success, data })`.
6. `<name>.routes.ts`: register with `requireAuth` + `validateBody`, **static path before `/:id`**.
7. `cd ../social-platform-be && npx tsc --noEmit`.

FE (`project_III`):
8. `src/feature/<x>/dto/<x>.dto.ts`: request/response/error wire types (match the BE DTO).
9. `src/feature/<x>/server/<x>Proxy.ts`: axios call w/ Bearer-from-cookie, envelope unwrap, error relay (copy `profileProxy.ts`).
10. `src/app/api/<x>/route.ts`: `export async function GET/POST/PATCH(req: NextRequest) { return <proxyFn>(req); }`.
11. `src/feature/<x>/services/<verb>.service.ts`: one function via `apiClient`, returns the unwrapped shape.
12. `src/feature/<x>/hooks/` (or a `use…` data hook): `useQuery`/`useMutation`; keep the public return shape stable if replacing localStorage/mock.
13. Wire the component: `await save()` → on success side-effects (toast/nav/socket emit), on throw `message.error`.
14. `npx tsc --noEmit` + `npx eslint <touched paths>`.

## Checklist before finishing an API change

- [ ] Browser calls only relative `/api/*` via `apiClient` — no direct BE URL, no token in client code/store.
- [ ] Proxy: reads `AUTH_COOKIE`, `401` when absent, axios (not fetch), `const`-only, relays BE status + `message`, `502` on unreachable.
- [ ] BE: `requireAuth` + `validateBody` on the route; static segments before `/:id`; controller thin; envelope `{ success, data }`; atomic multi-table via `$transaction`.
- [ ] zod schemas match FE↔BE 1:1; one service function per file.
- [ ] Migration created + applied from `../social-platform-be`; client regenerated.
- [ ] Persist-then-announce order if a realtime event is involved.
- [ ] `npx tsc --noEmit` clean both repos; `npx eslint` clean on touched FE files.
