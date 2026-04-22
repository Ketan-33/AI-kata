import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { guestsService } from '../services/guestsService.js';

const reject = (e) => e?.response?.data?.error || { message: e.message };

export const fetchGuests = createAsyncThunk('guests/fetch', async (_, { rejectWithValue }) => {
  try { return await guestsService.list(); } catch (e) { return rejectWithValue(reject(e)); }
});

export const createGuest = createAsyncThunk(
  'guests/create',
  async (payload, { rejectWithValue }) => {
    try { return await guestsService.create(payload); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const updateGuest = createAsyncThunk(
  'guests/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try { return await guestsService.update(id, payload); } catch (e) { return rejectWithValue(reject(e)); }
  }
);

export const deleteGuest = createAsyncThunk('guests/delete', async (id, { rejectWithValue }) => {
  try { await guestsService.remove(id); return id; } catch (e) { return rejectWithValue(reject(e)); }
});

const slice = createSlice({
  name: 'guests',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchGuests.pending, (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchGuests.fulfilled, (s, { payload }) => {
      s.status = 'succeeded';
      s.items = Array.isArray(payload) ? payload : payload.data || [];
    });
    b.addCase(fetchGuests.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; });
    b.addCase(createGuest.fulfilled, (s, { payload }) => { s.items.unshift(payload); });
    b.addCase(updateGuest.fulfilled, (s, { payload }) => {
      const i = s.items.findIndex((g) => g.id === payload.id);
      if (i >= 0) s.items[i] = payload;
    });
    b.addCase(deleteGuest.fulfilled, (s, { payload: id }) => {
      s.items = s.items.filter((g) => g.id !== id);
    });
  },
});

export const selectGuests = (s) => s.guests;
export default slice.reducer;
