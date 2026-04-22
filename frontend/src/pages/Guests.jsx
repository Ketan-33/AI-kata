import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PillButton from '../components/ui/PillButton.jsx';
import FormInput from '../components/ui/FormInput.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import TagInput from '../components/ui/TagInput.jsx';
import { fetchGuests, createGuest, deleteGuest, selectGuests } from '../store/guestsSlice.js';

export default function Guests() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectGuests);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');

  const [draft, setDraft] = useState({ name: '', bio: '', expertise: [], links: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => { dispatch(fetchGuests()); }, [dispatch]);

  const allExpertise = useMemo(() => {
    const set = new Set();
    items.forEach((g) => (g.expertise || []).forEach((t) => set.add(t)));
    return [...set];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((g) => {
      const matchQ = !q || g.name?.toLowerCase().includes(q) || g.bio?.toLowerCase().includes(q);
      const matchE = !expertiseFilter || (g.expertise || []).includes(expertiseFilter);
      return matchQ && matchE;
    });
  }, [items, query, expertiseFilter]);

  const submit = async (e) => {
    e.preventDefault();
    if (!draft.name.trim()) {
      setErrors({ name: 'Name is required.' });
      return;
    }
    const action = await dispatch(createGuest({ ...draft, name: draft.name.trim() }));
    if (action.meta.requestStatus === 'fulfilled') {
      setDraft({ name: '', bio: '', expertise: [], links: [] });
      setErrors({});
      setOpenModal(false);
    } else {
      setErrors(action.payload?.details || { name: action.payload?.message });
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen py-12">
      <div className="max-w-page mx-auto px-6">
        <SectionHeader
          title="Your Guests"
          subtitle="Build a roster of voices that bring your show to life."
          cta={
            <PillButton variant="primary" onClick={() => setOpenModal(true)}>
              + Add Guest
            </PillButton>
          }
        />

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guests…"
            aria-label="Search guests"
            className="rounded-pill bg-bg-secondary border border-white/10 px-5 py-3 text-sm md:w-80 outline-none focus:border-white/30"
          />
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            aria-label="Filter by expertise"
            className="rounded-pill bg-bg-secondary border border-white/10 px-5 py-3 text-sm outline-none focus:border-white/30"
          >
            <option value="">All expertise</option>
            {allExpertise.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <ErrorBanner error={error} />

        {status === 'loading' && <LoadingSpinner label="Loading guests…" />}

        {status !== 'loading' && filtered.length === 0 && (
          <EmptyState
            icon="👥"
            title="No guests yet"
            description="Add your first guest to start linking them to episodes."
            action={
              <PillButton variant="primary" onClick={() => setOpenModal(true)}>
                Add Guest
              </PillButton>
            }
          />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g) => (
            <article key={g.id} className="card-dark p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-bg-purple text-lg font-black">
                  {(g.name || '?').charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-bold leading-tight">{g.name}</h3>
                  <p className="text-text-secondary text-xs">
                    Episodes: {g.episodeCount ?? g.episodes?.length ?? 0}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary line-clamp-2">{g.bio || 'No bio yet.'}</p>
              <div className="flex flex-wrap gap-1.5">
                {(g.expertise || []).map((t) => (
                  <span key={t} className="rounded-pill bg-white/5 px-2.5 py-0.5 text-xs">{t}</span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <PillButton variant="outline" size="sm">View</PillButton>
                <PillButton
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(deleteGuest(g.id))}
                  aria-label={`Delete ${g.name}`}
                >
                  Delete
                </PillButton>
              </div>
            </article>
          ))}
        </div>
      </div>

      {openModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add guest"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4"
          onClick={() => setOpenModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="card-dark p-8 max-w-lg w-full flex flex-col gap-5"
            noValidate
          >
            <h3 className="text-xl font-bold">Add a Guest</h3>
            <FormInput
              label="Name"
              required
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              error={errors.name}
            />
            <FormInput
              label="Bio"
              as="textarea"
              rows={3}
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
            />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-text-secondary">Expertise</span>
              <TagInput
                value={draft.expertise}
                onChange={(expertise) => setDraft((d) => ({ ...d, expertise }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <PillButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
                Cancel
              </PillButton>
              <PillButton type="submit" variant="primary">Save Guest</PillButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
