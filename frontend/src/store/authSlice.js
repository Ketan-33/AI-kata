import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService.js';
import { setAuthToken, getAuthToken } from '../services/api.js';

export const loginThunk = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.login(payload);
    setAuthToken(data.token);
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.error || { message: e.message });
  }
});

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      setAuthToken(data.token);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.error || { message: e.message });
    }
  }
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authService.me();
  } catch (e) {
    return rejectWithValue(e?.response?.data?.error || { message: e.message });
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: getAuthToken(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      setAuthToken(null);
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (b) => {
    const handleAuth = (state, { payload }) => {
      state.status = 'succeeded';
      state.user = payload.user || state.user;
      state.token = payload.token || state.token;
      state.error = null;
    };
    b.addCase(loginThunk.pending, (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(loginThunk.fulfilled, handleAuth);
    b.addCase(loginThunk.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; });
    b.addCase(registerThunk.pending, (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(registerThunk.fulfilled, handleAuth);
    b.addCase(registerThunk.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; });
    b.addCase(fetchMe.fulfilled, (s, { payload }) => { s.user = payload; });
    b.addCase(fetchMe.rejected, (s) => { s.user = null; s.token = null; });
  },
});

export const { logout } = slice.actions;
export const selectAuth = (s) => s.auth;
export const selectIsAuthed = (s) => Boolean(s.auth.token);
export default slice.reducer;
