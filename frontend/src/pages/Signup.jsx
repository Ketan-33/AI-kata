import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/ui/FormInput.jsx';
import PillButton from '../components/ui/PillButton.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import { registerThunk, selectAuth } from '../store/authSlice.js';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const action = await dispatch(registerThunk(form));
    if (action.meta.requestStatus === 'fulfilled') navigate('/', { replace: true });
    else if (action.payload?.details) setErrors(action.payload.details);
  };

  return (
    <div className="bg-bg-primary min-h-screen grid place-items-center py-12 px-4">
      <form onSubmit={submit} className="card-dark p-8 md:p-12 w-full max-w-md flex flex-col gap-5" noValidate>
        <h1 className="text-3xl font-black">Start planning your show</h1>
        <p className="text-text-secondary -mt-3">Create a free account in seconds.</p>
        <ErrorBanner error={error?.message ? error : null} />
        <FormInput
          label="Name"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
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
          autoComplete="new-password"
          hint="At least 8 characters."
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />
        <PillButton type="submit" variant="primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating…' : 'Sign up →'}
        </PillButton>
        <p className="text-sm text-text-secondary text-center">
          Already a member? <Link to="/login" className="text-accent-lime font-bold">Log in</Link>
        </p>
      </form>
    </div>
  );
}
