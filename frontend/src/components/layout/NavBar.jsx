import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthed, logout } from '../../store/authSlice.js';
import PillButton from '../ui/PillButton.jsx';

const NAV = [
  { to: '/episodes', label: 'Episodes' },
  { to: '/scripts', label: 'Scripts' },
  { to: '/guests', label: 'Guests' },
  { to: '/analytics', label: 'Analytics' },
];

const linkClasses = ({ isActive }) =>
  `relative px-3 py-2 text-sm font-bold transition-colors ${
    isActive ? 'text-white' : 'text-text-secondary hover:text-white'
  }`;

const ActiveDot = ({ show }) =>
  show ? (
    <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-1.5 w-1.5 rounded-full bg-accent-green" />
  ) : null;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const authed = useSelector(selectIsAuthed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5">
      <nav
        aria-label="Primary"
        className="max-w-page mx-auto h-16 px-4 md:px-6 flex items-center justify-between"
      >
        <Link to={authed ? '/' : '/login'} className="flex items-center gap-2 font-black text-lg">
          <span aria-hidden>🎙️</span>
          PodPlanner
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={linkClasses}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    <ActiveDot show={isActive} />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {authed ? (
            <PillButton variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </PillButton>
          ) : (
            <>
              <PillButton as={Link} to="/login" variant="outline" size="sm">
                Log in
              </PillButton>
              <PillButton as={Link} to="/signup" variant="primary" size="sm">
                Sign up →
              </PillButton>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span aria-hidden>{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black">
          <ul className="flex flex-col px-4 py-3 gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-card text-text-secondary hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2 flex gap-2">
              {authed ? (
                <PillButton variant="outline" size="sm" onClick={handleLogout} className="flex-1">
                  Log out
                </PillButton>
              ) : (
                <>
                  <PillButton as={Link} to="/login" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                    Log in
                  </PillButton>
                  <PillButton as={Link} to="/signup" variant="primary" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                    Sign up
                  </PillButton>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
