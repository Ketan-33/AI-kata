import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/ui/FormInput.jsx';
import PillButton from '../components/ui/PillButton.jsx';
import TagInput from '../components/ui/TagInput.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import {
  createEpisode,
  fetchEpisode,
  updateEpisode,
  selectEpisodes,
  clearSelected,
} from '../store/episodesSlice.js';
import { fetchGuests, selectGuests } from '../store/guestsSlice.js';

const STATUSES = ['DRAFT', 'SCRIPTED', 'PUBLISHED'];

const empty = {
  title: '',
  number: '',
  description: '',
  guestId: '',
  status: 'DRAFT',
  scheduledAt: '',
  tags: [],
};

export default function EpisodeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== 'new';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected, status, error } = useSelector(selectEpisodes);
  const { items: guests } = useSelector(selectGuests);

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchGuests());
    if (isEdit) dispatch(fetchEpisode(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selected) {
      setForm({
        title: selected.title || '',
        number: selected.number ?? '',
        description: selected.description || '',
        guestId: selected.guests?.[0]?.id || '',
        status: selected.status || 'DRAFT',
        scheduledAt: selected.scheduledAt ? selected.scheduledAt.slice(0, 10) : '',
        tags: selected.tags || [],
      });
    }
  }, [isEdit, selected]);

  const change = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Episode title is required.';
    if (form.number !== '' && Number.isNaN(Number(form.number)))
      next.number = 'Episode number must be numeric.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (mode) => {
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      number: form.number === '' ? null : Number(form.number),
      description: form.description.trim() || null,
      status: form.status,
      scheduledAt: form.scheduledAt || null,
      tags: form.tags,
      guestIds: form.guestId ? [form.guestId] : [],
    };
    const action = isEdit
      ? await dispatch(updateEpisode({ id, payload }))
      : await dispatch(createEpisode(payload));

    if (action.meta.requestStatus === 'fulfilled') {
      const newId = action.payload.id;
      if (mode === 'generate') navigate(`/scripts?episode=${newId}`);
      else navigate('/episodes');
    } else {
      const details = action.payload?.details;
      if (details && typeof details === 'object') setErrors((e) => ({ ...e, ...details }));
    }
  };

  if (isEdit && status === 'loading' && !selected) return <LoadingSpinner label="Loading episode…" />;

  return (
    <div className="bg-bg-primary min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="h-section mb-2">{isEdit ? 'Edit Episode' : 'Create Episode'}</h1>
        <p className="text-text-secondary mb-8">
          Fill in the details below. Required fields are marked with <span className="text-status-draft">*</span>.
        </p>

        <ErrorBanner error={error?.message ? error : null} />

        <form
          onSubmit={(e) => { e.preventDefault(); submit('save'); }}
          className="card-dark p-8 md:p-12 flex flex-col gap-6"
          noValidate
        >
          <FormInput
            label="Episode Title"
            required
            value={form.title}
            onChange={change('title')}
            error={errors.title}
            placeholder="e.g. Bootstrapping in Public"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Episode Number"
              type="number"
              min="0"
              value={form.number}
              onChange={change('number')}
              error={errors.number}
            />
            <FormInput
              label="Scheduled Date"
              type="date"
              value={form.scheduledAt}
              onChange={change('scheduledAt')}
            />
          </div>

          <FormInput
            label="Description"
            as="textarea"
            rows={4}
            value={form.description}
            onChange={change('description')}
            placeholder="What's this episode about?"
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="guest" className="text-sm font-bold text-text-secondary">
              Guest
            </label>
            <select
              id="guest"
              value={form.guestId}
              onChange={change('guestId')}
              className="bg-bg-secondary text-text-primary rounded-card px-4 py-3 border border-white/10 outline-none focus:border-white/30"
            >
              <option value="">— No guest —</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-text-secondary">Status</span>
            <div role="radiogroup" aria-label="Status" className="inline-flex bg-bg-secondary rounded-pill p-1 border border-white/10 self-start">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={form.status === s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`rounded-pill px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                    form.status === s ? 'bg-white text-text-dark' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-text-secondary">Tags</span>
            <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-text-secondary">Cover Art</span>
            <div className="rounded-card border-2 border-dashed border-white/15 p-8 text-center text-text-secondary">
              <p className="font-bold text-white">Drag & drop an image</p>
              <p className="text-sm">PNG or JPG up to 4MB (upload coming soon)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <PillButton type="button" variant="outline" onClick={() => submit('save')}>
              Save as Draft
            </PillButton>
            <PillButton type="button" variant="lime" onClick={() => submit('generate')}>
              Save & Generate Script →
            </PillButton>
          </div>
        </form>
      </div>
    </div>
  );
}
