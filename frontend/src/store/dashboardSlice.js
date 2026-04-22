import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboardService.js';

export const fetchSummary = createAsyncThunk(
  'dashboard/summary',
  async (_, { rejectWithValue }) => {
    try { return await dashboardService.summary(); }
    catch (e) { return rejectWithValue(e?.response?.data?.error || { message: e.message }); }
  }
);

const slice = createSlice({
  name: 'dashboard',
  initialState: { summary: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSummary.pending, (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchSummary.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.summary = payload; });
    b.addCase(fetchSummary.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; });
  },
});

export const selectDashboard = (s) => s.dashboard;
export default slice.reducer;
