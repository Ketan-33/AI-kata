import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEpisodes, selectEpisodes } from '../store/episodesSlice.js';

export default function useEpisodes(filter) {
  const dispatch = useDispatch();
  const state = useSelector(selectEpisodes);
  useEffect(() => {
    const params = filter && filter !== 'all' ? { status: filter.toUpperCase() } : undefined;
    dispatch(fetchEpisodes(params));
  }, [dispatch, filter]);
  return state;
}
