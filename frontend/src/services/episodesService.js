import api from './api.js';

export const episodesService = {
  list: (params = {}) => api.get('/episodes', { params }).then((r) => r.data),
  get: (id) => api.get(`/episodes/${id}`).then((r) => r.data),
  create: (payload) => api.post('/episodes', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/episodes/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/episodes/${id}`).then((r) => r.data),
  attachGuest: (id, guestId) =>
    api.post(`/episodes/${id}/guests`, { guestId }).then((r) => r.data),
  detachGuest: (id, guestId) =>
    api.delete(`/episodes/${id}/guests/${guestId}`).then((r) => r.data),
};
