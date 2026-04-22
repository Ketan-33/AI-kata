export default function GuestChip({ guest, onRemove }) {
  if (!guest) return null;
  const initial = (guest.name || '?').charAt(0).toUpperCase();
  return (
    <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 pl-1 pr-3 py-1 text-sm">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-bg-purple text-xs font-bold">
        {initial}
      </span>
      {guest.name}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(guest)}
          aria-label={`Remove guest ${guest.name}`}
          className="ml-1 text-text-secondary hover:text-white"
        >
          ×
        </button>
      )}
    </span>
  );
}
