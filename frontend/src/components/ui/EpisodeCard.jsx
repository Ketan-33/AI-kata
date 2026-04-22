import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import GuestChip from './GuestChip.jsx';
import PillButton from './PillButton.jsx';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export default function EpisodeCard({ episode, onGenerate, variant = 'row' }) {
  if (!episode) return null;
  const { id, title, number, status, createdAt, guests = [] } = episode;

  if (variant === 'tile') {
    return (
      <article className="card-dark p-6 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={status} />
          {number != null && (
            <span className="text-text-secondary text-xs font-medium">EP {number}</span>
          )}
        </div>
        <h3 className="text-xl font-bold leading-tight line-clamp-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {guests.slice(0, 2).map((g) => (
            <GuestChip key={g.id} guest={g} />
          ))}
          {guests.length > 2 && (
            <span className="text-text-secondary text-xs self-center">
              +{guests.length - 2} more
            </span>
          )}
        </div>
        <p className="text-text-secondary text-sm mt-auto">Created {fmt(createdAt)}</p>
        <div className="flex gap-2">
          <PillButton as={Link} to={`/episodes/${id}`} variant="outline" size="sm">
            Edit
          </PillButton>
          <PillButton as={Link} to={`/scripts?episode=${id}`} variant="lime" size="sm">
            Generate Script
          </PillButton>
        </div>
      </article>
    );
  }

  return (
    <article className="card-dark p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div
        className="h-20 w-20 rounded-card bg-gradient-to-br from-bg-purple to-bg-deepPurple grid place-items-center text-2xl font-black shrink-0"
        aria-hidden
      >
        🎙️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg md:text-xl font-bold truncate">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {guests.length === 0 ? (
            <span className="text-text-secondary text-sm">No guests yet</span>
          ) : (
            guests.map((g) => <GuestChip key={g.id} guest={g} />)
          )}
        </div>
        <p className="text-text-secondary text-xs mt-2">Created {fmt(createdAt)}</p>
      </div>
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        <PillButton as={Link} to={`/episodes/${id}`} variant="outline" size="sm">
          Edit
        </PillButton>
        <PillButton onClick={() => onGenerate?.(episode)} variant="lime" size="sm">
          Generate Script
        </PillButton>
      </div>
    </article>
  );
}
