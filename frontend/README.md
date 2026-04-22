# PodPlanner — Frontend

React 18 + Vite + Tailwind + Redux Toolkit + React Router v6 + Axios.

Visual language: dark Spotify-for-Creators aesthetic (near-black / periwinkle / deep purple, lime + green accents, pill buttons, 16px-radius cards). Tokens live in [tailwind.config.js](tailwind.config.js) and CSS variables in [src/styles/globals.css](src/styles/globals.css).

## Quick start

```bash
cd frontend
npm install
cp .env.example .env       # then edit if needed
npm run dev                # http://localhost:5173
```

Backend is expected at `http://localhost:4000/api` (configurable via `VITE_API_BASE_URL`). See [PROJECT.md](../PROJECT.md) §5 for the full API surface.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run Vitest + RTL test suite |
| `npm run lint` | Lint with ESLint |

## Layout

```
src/
├── App.jsx, main.jsx
├── components/
│   ├── layout/   NavBar, Footer
│   ├── ui/       PillButton, StatusBadge, EpisodeCard, GuestChip,
│   │             StatCard, AIOutputPanel, SectionHeader,
│   │             SplitCTASection, SocialFollowSection, FormInput, TagInput
│   └── shared/   LoadingSpinner, EmptyState, ErrorBanner
├── hooks/        useAuth, useEpisodes
├── pages/        Dashboard, Episodes, EpisodeForm, ScriptGenerator,
│                 Guests, Analytics, Login, Signup, NotFound
├── routes/       RequireAuth.jsx
├── services/     api.js (axios instance) + per-domain services
├── store/        Redux store + slices (auth, episodes, guests, ai, dashboard)
├── styles/       globals.css (CSS vars + base styles)
└── test/         Vitest setup + tests
```

## Conventions (per [.github/agents/frontend-dev.agent.md](../.github/agents/frontend-dev.agent.md))

- Async data via `createAsyncThunk` only — no raw `fetch` in components.
- All HTTP through `services/api.js` — never hardcode URLs.
- JWT held in `sessionStorage` + in-memory; auth interceptor attaches `Authorization` header; 401 triggers logout + `/login` redirect.
- All AI calls go through the backend (`/api/ai/*`) — never call DIAL from the frontend.
- Tailwind only — no inline `style` (except dynamic measurements), no CSS modules.
- Every page has loading + empty + error states.
- A11y: semantic `<nav>`, visible `:focus-visible` ring, `aria-live` on async regions, color contrast ≥ 4.5:1.

## Routes

| Path | Page | Auth |
| ---- | ---- | ---- |
| `/` | Dashboard | ✅ |
| `/episodes` | Episodes list | ✅ |
| `/episodes/new` | New episode form | ✅ |
| `/episodes/:id` | Edit episode | ✅ |
| `/scripts` | AI script generator | ✅ |
| `/guests` | Guest manager | ✅ |
| `/analytics` | Analytics dashboard | ✅ |
| `/login`, `/signup` | Auth | — |

## Notes vs. design brief

- File layout follows the locked blueprint (`store/` + `services/`) instead of `features/` per [PROJECT.md](../PROJECT.md) §3 and the agent spec. Slice + service split is equivalent.
- AI endpoints use the contract `/ai/outline | /ai/script | /ai/questions` (PROJECT.md §5), not `/scripts/generate`. Update `docs/API_CONTRACT.md` if this changes.
- Cover-art upload and AI chat refinement are wired as placeholders — they'll light up once their backend endpoints land in the contract.
