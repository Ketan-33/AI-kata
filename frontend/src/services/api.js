import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Token is held in-memory + sessionStorage (XSS-safer than localStorage).
// See frontend-dev.agent.md hard rules.
const TOKEN_KEY = 'pp_token';
let memoryToken = sessionStorage.getItem(TOKEN_KEY) || null;

export const setAuthToken = (token) => {
  memoryToken = token || null;
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
};

export const getAuthToken = () => memoryToken;

api.interceptors.request.use((config) => {
  if (memoryToken) config.headers.Authorization = `Bearer ${memoryToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      setAuthToken(null);
      // Soft redirect to /login if we're in the browser.
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
