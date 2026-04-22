import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { episodesService } from '../services/episodesService.js';

const reject = (e) => e?.response?.data?.error || { message: e.message };

export const fetchEpisodes = createAsyncThunk(
  'episodes/fetch',
  async (params, { rejectWithValue }) => {
    try { return await episodesService.list(params); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const fetchEpisode = createAsyncThunk(
  'episodes/fetchOne',
  async (id, { rejectWithValue }) => {
    try { return await episodesService.get(id); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const createEpisode = createAsyncThunk(
  'episodes/create',
  async (payload, { rejectWithValue }) => {
    try { return await episodesService.create(payload); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const updateEpisode = createAsyncThunk(
  'episodes/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try { return await episodesService.update(id, payload); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const deleteEpisode = createAsyncThunk(
  'episodes/delete',
  async (id, { rejectWithValue }) => {
    try { await episodesService.remove(id); return id; } catch (e) { return rejectWithValue(reject(e)); }
  }
);

const slice = createSlice({
  name: 'episodes',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    filter: 'all', // 'all' | 'draft' | 'scripted' | 'published'
    error: null,
  },
  reducers: {
    setFilter(state, { payload }) { state.filter = payload; },
    clearSelected(state) { state.selected = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchEpisodes.pending, (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchEpisodes.fulfilled, (s, { payload }) => {
      s.status = 'succeeded';
      s.items = Array.isArray(payload) ? payload : payload.data || [];
    });
    b.addCase(fetchEpisodes.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; });
    b.addCase(fetchEpisode.fulfilled, (s, { payload }) => { s.selected = payload; });
    b.addCase(createEpisode.fulfilled, (s, { payload }) => { s.items.unshift(payload); });
    b.addCase(updateEpisode.fulfilled, (s, { payload }) => {
      const i = s.items.findIndex((e) => e.id === payload.id);
      if (i >= 0) s.items[i] = payload;
      if (s.selected?.id === payload.id) s.selected = payload;
    });
    b.addCase(deleteEpisode.fulfilled, (s, { payload: id }) => {
      s.items = s.items.filter((e) => e.id !== id);
    });
  },
});

export const { setFilter, clearSelected } = slice.actions;
export const selectEpisodes = (s) => s.episodes;
export default slice.reducer;
