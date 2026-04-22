export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-10 text-text-secondary">
      <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
