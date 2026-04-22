import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import episodesReducer from './episodesSlice.js';
import guestsReducer from './guestsSlice.js';
import aiReducer from './aiSlice.js';
import dashboardReducer from './dashboardSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    episodes: episodesReducer,
    guests: guestsReducer,
    ai: aiReducer,
    dashboard: dashboardReducer,
  },
});
