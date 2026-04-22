import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PillButton from '../components/ui/PillButton.jsx';
import EpisodeCard from '../components/ui/EpisodeCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import useEpisodes from '../hooks/useEpisodes.js';
import { setFilter } from '../store/episodesSlice.js';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'scripted', label: 'Scripted' },
  { key: 'published', label: 'Published' },
];

export default function Episodes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const { items, status, error, filter } = useEpisodes(tab);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (ep) =>
        ep.title?.toLowerCase().includes(q) ||
        ep.guests?.some((g) => g.name?.toLowerCase().includes(q))
    );
  }, [items, query]);

  const onTab = (key) => {
    setTab(key);
    dispatch(setFilter(key));
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-page mx-auto px-6 py-12">
        <SectionHeader
          title="Your Episodes"
          subtitle="Plan, draft, script, and publish — all in one workspace."
          cta={
            <PillButton as={Link} to="/episodes/new" variant="primary">
              + New Episode
            </PillButton>
          }
        />

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div role="tablist" aria-label="Filter by status" className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => onTab(t.key)}
                className={`rounded-pill px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key
                    ? 'bg-white text-text-dark'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes or guests…"
            aria-label="Search episodes"
            className="md:ml-auto rounded-pill bg-bg-secondary border border-white/10 px-5 py-3 text-sm w-full md:w-80 outline-none focus:border-white/30"
          />
        </div>

        <ErrorBanner error={error} />

        {status === 'loading' && <LoadingSpinner label="Loading episodes…" />}

        {status !== 'loading' && filtered.length === 0 && (
          <EmptyState
            icon="🎙️"
            title={query ? 'No matches' : 'No episodes here yet'}
            description={
              query
                ? 'Try a different search term or clear the filter.'
                : 'Create your first episode to get started.'
            }
            action={
              !query && (
                <PillButton onClick={() => navigate('/episodes/new')} variant="primary">
                  Create Episode
                </PillButton>
              )
            }
          />
        )}

        <div className="flex flex-col gap-4">
          {filtered.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              onGenerate={(e) => navigate(`/scripts?episode=${e.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
