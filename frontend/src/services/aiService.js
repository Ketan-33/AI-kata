import api from './api.js';

// Mirrors PROJECT.md §5 — every AI call goes through the backend.
export const aiService = {
  outline: (payload) => api.post('/ai/outline', payload).then((r) => r.data),
  script: (payload) => api.post('/ai/script', payload).then((r) => r.data),
  questions: (payload) => api.post('/ai/questions', payload).then((r) => r.data),
};
