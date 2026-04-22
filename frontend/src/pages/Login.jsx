import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/ui/FormInput.jsx';
import PillButton from '../components/ui/PillButton.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import { loginThunk, selectAuth } from '../store/authSlice.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const action = await dispatch(loginThunk(form));
    if (action.meta.requestStatus === 'fulfilled') {
      const to = location.state?.from?.pathname || '/';
      navigate(to, { replace: true });
    } else if (action.payload?.details) {
      setErrors(action.payload.details);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen grid place-items-center py-12 px-4">
      <form onSubmit={submit} className="card-dark p-8 md:p-12 w-full max-w-md flex flex-col gap-5" noValidate>
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="text-text-secondary -mt-3">Log in to plan your next episode.</p>
        <ErrorBanner error={error?.message ? error : null} />
        <FormInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />
        <PillButton type="submit" variant="primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in…' : 'Log in'}
        </PillButton>
        <p className="text-sm text-text-secondary text-center">
          New here? <Link to="/signup" className="text-accent-lime font-bold">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
