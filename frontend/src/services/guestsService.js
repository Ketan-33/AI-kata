import api from './api.js';

export const guestsService = {
  list: () => api.get('/guests').then((r) => r.data),
  create: (payload) => api.post('/guests', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/guests/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/guests/${id}`).then((r) => r.data),
};
