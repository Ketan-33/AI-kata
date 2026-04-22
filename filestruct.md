src/
├── app/
│   └── store.js                    # Redux store
├── features/
│   ├── episodes/
│   │   ├── episodesSlice.js
│   │   └── episodesAPI.js
│   ├── guests/
│   │   ├── guestsSlice.js
│   │   └── guestsAPI.js
│   ├── scripts/
│   │   ├── scriptsSlice.js
│   │   └── scriptsAPI.js
│   └── auth/
│       ├── authSlice.js
│       └── authAPI.js
├── components/
│   ├── ui/                         # All reusable components
│   ├── layout/
│   │   ├── NavBar.jsx
│   │   └── Footer.jsx
│   └── shared/
│       ├── LoadingSpinner.jsx
│       └── EmptyState.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Episodes.jsx
│   ├── EpisodeForm.jsx
│   ├── ScriptGenerator.jsx
│   ├── Guests.jsx
│   ├── Analytics.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── hooks/
│   ├── useEpisodes.js
│   └── useAuth.js
└── styles/
    └── globals.css                 # CSS variables + base styles