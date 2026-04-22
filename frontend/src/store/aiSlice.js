import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiService } from '../services/aiService.js';

const reject = (e) => e?.response?.data?.error || { message: e.message };

// kind: 'script' | 'outline' | 'questions' (from PROJECT.md AIGeneration.kind)
export const generateContent = createAsyncThunk(
  'ai/generate',
  async ({ kind, payload }, { rejectWithValue }) => {
    try {
      if (kind === 'outline') return { kind, data: await aiService.outline(payload) };
      if (kind === 'questions') return { kind, data: await aiService.questions(payload) };
      return { kind: 'script', data: await aiService.script(payload) };
    } catch (e) {
      return rejectWithValue(reject(e));
    }
  }
);

const slice = createSlice({
  name: 'ai',
  initialState: {
    generated: null,         // last generation result
    kind: 'script',          // 'script' | 'outline' | 'questions'
    tone: 'casual',          // casual | professional | storytelling | educational
    length: 'medium',        // short | medium | long
    customPrompt: '',
    chatHistory: [],         // [{ role, content }]
    isGenerating: false,
    error: null,
  },
  reducers: {
    setKind(s, { payload }) { s.kind = payload; },
    setTone(s, { payload }) { s.tone = payload; },
    setLength(s, { payload }) { s.length = payload; },
    setCustomPrompt(s, { payload }) { s.customPrompt = payload; },
    appendChat(s, { payload }) { s.chatHistory.push(payload); },
    clearGenerated(s) { s.generated = null; s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(generateContent.pending, (s) => { s.isGenerating = true; s.error = null; });
    b.addCase(generateContent.fulfilled, (s, { payload }) => {
      s.isGenerating = false;
      s.generated = payload;
    });
    b.addCase(generateContent.rejected, (s, { payload }) => {
      s.isGenerating = false;
      s.error = payload;
    });
  },
});

export const { setKind, setTone, setLength, setCustomPrompt, appendChat, clearGenerated } =
  slice.actions;
export const selectAi = (s) => s.ai;
export default slice.reducer;
