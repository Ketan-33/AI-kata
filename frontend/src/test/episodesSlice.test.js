import { describe, it, expect } from 'vitest';
import reducer, { setFilter } from '../store/episodesSlice.js';

describe('episodesSlice', () => {
  it('has expected initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      items: [],
      selected: null,
      status: 'idle',
      filter: 'all',
      error: null,
    });
  });

  it('updates filter via setFilter action', () => {
    const next = reducer(undefined, setFilter('draft'));
    expect(next.filter).toBe('draft');
  });
});
