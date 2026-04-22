const styles = {
  DRAFT: 'bg-status-draft/20 text-status-draft border border-status-draft/40',
  SCRIPTED: 'bg-status-scripted/25 text-white border border-status-scripted/60',
  PUBLISHED: 'bg-status-published/20 text-status-published border border-status-published/40',
};

const labels = { DRAFT: 'Draft', SCRIPTED: 'Scripted', PUBLISHED: 'Published' };
const dots = { DRAFT: '🟡', SCRIPTED: '🔵', PUBLISHED: '🟢' };

export default function StatusBadge({ status = 'DRAFT', className = '' }) {
  const key = String(status).toUpperCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wide ${styles[key] || styles.DRAFT} ${className}`}
      aria-label={`Status: ${labels[key] || key}`}
    >
      <span aria-hidden>{dots[key] || '⚪'}</span>
      {labels[key] || key}
    </span>
  );
}
