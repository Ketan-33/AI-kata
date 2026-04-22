import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthed } from '../store/authSlice.js';

export default function RequireAuth({ children }) {
  const authed = useSelector(selectIsAuthed);
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
