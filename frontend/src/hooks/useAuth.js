import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, selectAuth, selectIsAuthed } from '../store/authSlice.js';

export default function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const isAuthed = useSelector(selectIsAuthed);

  useEffect(() => {
    if (isAuthed && !auth.user) dispatch(fetchMe());
  }, [dispatch, isAuthed, auth.user]);

  return { ...auth, isAuthed };
}
