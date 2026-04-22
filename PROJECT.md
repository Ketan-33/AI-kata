# Podcast Episode Planner — Build Blueprint

> Single source of truth for **all agents** building this project.
> PM-Agent orchestrates; sub-agents in `.github/agents/` execute. Read this file before planning, scaffolding, or coding.

---

## 1. Vision

A full-stack web app that helps podcasters plan episodes end-to-end: manage a guest roster, draft episodes, and use an LLM (EPAM DIAL) to generate outlines, scripts, and interview questions. MVP is local-first (SQLite) and runnable with two `npm run dev` commands.

## 2. Tech Stack (locked)

| Layer    | Choice                                                                   |
| -------- | ------------------------------------------------------------------------ |
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Axios      |
| Backend  | Node 20+, Express 4 (CommonJS), zod, JWT, bcrypt                         |
| Database | Prisma ORM + SQLite (file-backed; `file:./dev.db`)                       |
| AI       | EPAM DIAL via the OpenAI SDK (`baseURL` override). Default model `gpt-4` |
| Tests    | Jest + Supertest (BE), Vitest + RTL (FE), Cypress (E2E)                  |
| Tooling  | ESLint, Prettier, dotenv                                                 |

Do **not** swap any of these without an ADR + PM-Agent approval.

## 3. Repository Layout (target)

```
AI-kata/
├── PROJECT.md                ← this file
├── .agent.md                 ← PM-Agent spec
├── .github/agents/           ← sub-agent specs
├── docs/
│   ├── API_CONTRACT.md       ← request/response shapes (single source of truth for FE↔BE)
│   ├── USER_GUIDE.md
│   └── adr/                  ← architecture decision records
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── index.js          ← entrypoint, loads env, calls createApp().listen
│   │   ├── app.js            ← createApp() factory (used by tests)
│   │   ├── routes/           ← Express routers, thin wiring only
│   │   ├── controllers/      ← zod-validated handlers
│   │   ├── services/
│   │   │   └── ai/dial.js    ← DIAL client + prompt builders
│   │   ├── middleware/       ← requireAuth, errorHandler, rateLimit
│   │   └── utils/            ← errors.js, asyncHandler.js, jwt.js
│   ├── tests/                ← Jest + Supertest
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── pages/            ← Login, Register, Dashboard, EpisodeDetail, Guests, Settings
    │   ├── components/       ← shared UI (Button, Input, Modal, ...)
    │   ├── store/            ← Redux slices (auth, episodes, guests, ai, dashboard)
    │   ├── services/         ← api.js (axios instance) + per-domain service files
    │   ├── hooks/
    │   └── routes/RequireAuth.jsx
    ├── cypress/              ← E2E specs
    ├── .env.example
    └── package.json
```

## 4. Domain Model (Prisma)

- `User` 1—N `Episode`, 1—N `Guest`
- `Episode` N—N `Guest` via `EpisodeGuest`
- `Episode` 1—N `AIGeneration`
- `Episode.status`: `DRAFT | SCRIPTED | PUBLISHED` (string enum)
- `AIGeneration.kind`: `OUTLINE | SCRIPT | QUESTIONS`
- `Guest.links`: JSON-encoded `string[]`
- All user-owned tables cascade-delete on `User` deletion
- All tables: `createdAt @default(now())`, `updatedAt @updatedAt`

Schema is owned by **Database-Architect**. Any change requires updating affected controllers + zod schemas + `docs/API_CONTRACT.md` in the same PR.

## 5. API Surface (high-level — full shapes live in `docs/API_CONTRACT.md`)

Base URL: `http://localhost:4000/api`

| Method | Path                        | Auth | Purpose                               |
| ------ | --------------------------- | ---- | ------------------------------------- |
| POST   | `/auth/register`            | —    | Create user, return JWT               |
| POST   | `/auth/login`               | —    | Return JWT                            |
| GET    | `/auth/me`                  | yes  | Current user                          |
| GET    | `/episodes`                 | yes  | Paginated list (filter by status)     |
| POST   | `/episodes`                 | yes  | Create episode                        |
| GET    | `/episodes/:id`             | yes  | Episode detail incl. guests, gens     |
| PATCH  | `/episodes/:id`             | yes  | Update fields / status                |
| DELETE | `/episodes/:id`             | yes  | Cascade delete                        |
| POST   | `/episodes/:id/guests`      | yes  | Attach guest (body: `{ guestId }`)    |
| DELETE | `/episodes/:id/guests/:gid` | yes  | Detach guest                          |
| GET    | `/guests`                   | yes  | List user's guests                    |
| POST   | `/guests`                   | yes  | Create guest                          |
| PATCH  | `/guests/:id`               | yes  | Update guest                          |
| DELETE | `/guests/:id`               | yes  | Delete guest                          |
| POST   | `/ai/outline`               | yes  | Body `{ episodeId, tone?, length? }`  |
| POST   | `/ai/script`                | yes  | Generates + sets `episode.script`     |
| POST   | `/ai/questions`             | yes  | Returns `{ generation, questions[] }` |
| GET    | `/dashboard/summary`        | yes  | Counts by status, recent episodes     |

### Conventions (apply to every endpoint)

- Auth header: `Authorization: Bearer <jwt>`
- Success body: raw resource, or `{ data, page, pageSize, total }` for lists
- Error body: `{ error: { code, message, details? } }`
- Ownership: every read/write checks `ownerId === req.user.id`
- Validation: zod at the controller boundary; reject extra fields
- Errors: throw via `utils/errors.js` helpers, never `res.status().json(...)` directly

## 6. AI Integration Contract

- Provider: EPAM DIAL via `openai` SDK with `baseURL` override
- Required env: `DIAL_API_KEY`, `DIAL_BASE_URL`, `DIAL_MODEL` (default `gpt-4`)
- All AI calls go through the backend — **never** call DIAL from the frontend
- Every successful generation persists to `AIGeneration` with token counts
- Failures surface as `aiProviderError` → HTTP 502 / code `AI_PROVIDER_ERROR`
- `max_tokens` always bounded (default 1200, scripts up to 2400)
- Tests mock `services/ai/dial.chat` — never hit the network in CI

## 7. Environment Variables

`backend/.env`:

```
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
DIAL_API_KEY=""
DIAL_BASE_URL=""
DIAL_MODEL="gpt-4"
```

`frontend/.env`:

```
VITE_API_BASE_URL="http://localhost:4000/api"
```

Both folders ship a committed `.env.example`. Real `.env` files are gitignored.

## 8. Run & Build Commands

First-time setup (from repo root):

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed            # optional demo data
npm run dev             # http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev             # http://localhost:5173
```

Tests:

```bash
cd backend  && npm test              # Jest + Supertest
cd frontend && npm test              # Vitest + RTL
cd frontend && npm run cypress:run   # E2E
```

Build:

```bash
cd frontend && npm run build         # static assets in dist/
cd backend  && npm start             # production server (NODE_ENV=production)
```

## 9. Sprint Plan (MVP)

Priority order is fixed: **Auth → Core CRUD → AI → Polish**.

| Sprint | Goal                               | Owner agents                           | Exit criteria                             |
| ------ | ---------------------------------- | -------------------------------------- | ----------------------------------------- |
| S0     | Scaffold repo, env, lint, CI hooks | Backend-Dev, Frontend-Dev              | Both `npm run dev` boot to a hello page   |
| S1     | Prisma schema + migrations + seed  | Database-Architect                     | `prisma migrate status` clean; seed runs  |
| S2     | Auth (register, login, /me, guard) | Backend-Dev, Frontend-Dev, QA-Tester   | Cypress journey 1 passes                  |
| S3     | Episodes + Guests CRUD             | Backend-Dev, Frontend-Dev, QA-Tester   | Cypress journey 2 passes                  |
| S4     | AI: outline, script, questions     | AI-Engineer, Backend-Dev, Frontend-Dev | Cypress journey 3 passes                  |
| S5     | Dashboard, status flow, PDF export | Frontend-Dev, Backend-Dev              | Cypress journey 4 passes                  |
| S6     | Polish: a11y, perf, docs, ADRs     | QA-Tester, Documentation               | All 5 Cypress journeys + Integration PASS |

Every sprint ends with the **Integration** agent's 6-step checklist before QA sign-off.

## 10. Definition of Done (per task)

- Code matches `docs/API_CONTRACT.md` (or contract updated in the same PR)
- zod validation + ownership check on every protected endpoint
- Unit test added/updated; suite green
- Loading / empty / error states present on every new page
- No secrets in logs; no `.only` / `.skip` in tests
- Docs touched if user-visible behavior changed

## 11. Hard Rules (non-negotiable)

1. **Never** call DIAL from the frontend.
2. **Never** bypass `requireAuth` on user-owned resources.
3. **Never** edit migration SQL by hand — always `prisma migrate dev`.
4. **Never** skip Integration or QA phases before release.
5. **Never** silently drift from `docs/API_CONTRACT.md` — update it explicitly.
6. **Never** push, force-push, or deploy without explicit user instruction.

## 12. Agent Roster

See [.github/agents/README.md](.github/agents/README.md). Quick reference:

| Concern                           | Agent                       |
| --------------------------------- | --------------------------- |
| Sprint planning, delegation       | PM-Agent (root `.agent.md`) |
| Express routes / controllers      | Backend-Dev                 |
| React pages / slices / services   | Frontend-Dev                |
| Prisma schema / migrations        | Database-Architect          |
| DIAL prompts / AI service wrapper | AI-Engineer                 |
| Tests at every layer              | QA-Tester                   |
| Contract diff + smoke test        | Integration                 |
| README / API docs / ADRs          | Documentation               |

## 13. First Actions for a Fresh Clone

1. Read this file end-to-end.
2. Read `.agent.md` and the relevant sub-agent spec under `.github/agents/`.
3. If `docs/API_CONTRACT.md` is missing, **Documentation** + **Backend-Dev** create it from §5 above before any controller is written.
4. Run Sprint S0 scaffolding tasks; do not skip ahead.
