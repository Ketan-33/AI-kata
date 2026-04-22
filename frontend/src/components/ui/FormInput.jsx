import { useId } from 'react';

export default function FormInput({
  label,
  error,
  hint,
  as = 'input',
  className = '',
  required,
  ...rest
}) {
  const id = useId();
  const Tag = as;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-text-secondary">
          {label}
          {required && <span className="text-status-draft ml-1" aria-hidden>*</span>}
        </label>
      )}
      <Tag
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={`bg-bg-secondary text-text-primary placeholder:text-text-secondary/60 rounded-card px-4 py-3 border ${
          error ? 'border-status-draft' : 'border-white/10 focus:border-white/30'
        } outline-none transition-colors w-full`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-status-draft" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
