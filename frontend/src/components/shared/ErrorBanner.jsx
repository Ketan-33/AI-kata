export default function ErrorBanner({ error }) {
  if (!error) return null;
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong.';
  return (
    <div
      role="alert"
      className="rounded-card border border-status-draft/50 bg-status-draft/10 text-status-draft px-4 py-3 text-sm"
    >
      {message}
    </div>
  );
}
