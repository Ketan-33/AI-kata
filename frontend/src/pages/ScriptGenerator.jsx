import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PillButton from '../components/ui/PillButton.jsx';
import AIOutputPanel from '../components/ui/AIOutputPanel.jsx';
import FormInput from '../components/ui/FormInput.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import {
  generateContent,
  selectAi,
  setKind,
  setTone,
  setLength,
  setCustomPrompt,
  appendChat,
  clearGenerated,
} from '../store/aiSlice.js';
import { fetchEpisodes, selectEpisodes } from '../store/episodesSlice.js';

const KINDS = [
  { key: 'script', label: 'Full Script' },
  { key: 'questions', label: 'Interview Questions' },
  { key: 'outline', label: 'Episode Outline' },
];
const TONES = ['casual', 'professional', 'storytelling', 'educational'];
const LENGTHS = [
  { key: 'short', label: 'Short (5 min)' },
  { key: 'medium', label: 'Medium (15 min)' },
  { key: 'long', label: 'Long (30 min+)' },
];

const extractText = (gen) => {
  if (!gen) return '';
  const data = gen.data || {};
  if (typeof data === 'string') return data;
  if (data.script) return data.script;
  if (data.outline) return data.outline;
  if (Array.isArray(data.questions)) return data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  if (data.generation?.content) return data.generation.content;
  return JSON.stringify(data, null, 2);
};

export default function ScriptGenerator() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items: episodes } = useSelector(selectEpisodes);
  const ai = useSelector(selectAi);

  const [episodeId, setEpisodeId] = useState(params.get('episode') || '');
  const [chatDraft, setChatDraft] = useState('');

  useEffect(() => { dispatch(fetchEpisodes()); }, [dispatch]);

  useEffect(() => {
    if (episodeId) setParams({ episode: episodeId });
  }, [episodeId, setParams]);

  const selectedEpisode = useMemo(
    () => episodes.find((e) => e.id === episodeId),
    [episodes, episodeId]
  );

  const generate = () => {
    if (!episodeId) return;
    dispatch(
      generateContent({
        kind: ai.kind,
        payload: {
          episodeId,
          tone: ai.tone,
          length: ai.length,
          customPrompt: ai.customPrompt || undefined,
        },
      })
    );
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;
    dispatch(appendChat({ role: 'user', content: chatDraft.trim() }));
    setChatDraft('');
    // Real refinement endpoint would be wired here once available in API_CONTRACT.
  };

  const generatedText = extractText(ai.generated);

  return (
    <div className="bg-bg-primary min-h-screen py-10">
      <div className="max-w-page mx-auto px-6 grid lg:grid-cols-5 gap-8">
        {/* Left: controls */}
        <aside className="lg:col-span-2 card-dark p-6 flex flex-col gap-5 h-fit">
          <h2 className="h-section text-2xl">Generate Your Script</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="ep" className="text-sm font-bold text-text-secondary">Episode</label>
            <select
              id="ep"
              value={episodeId}
              onChange={(e) => setEpisodeId(e.target.value)}
              className="bg-bg-primary border border-white/10 rounded-card px-4 py-3 outline-none focus:border-white/30"
            >
              <option value="">— Select an episode —</option>
              {episodes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.number != null ? `EP ${e.number} · ` : ''}{e.title}
                </option>
              ))}
            </select>
          </div>

          {selectedEpisode && (
            <div className="text-sm text-text-secondary">
              Guest: {selectedEpisode.guests?.[0]?.name || 'None'}
            </div>
          )}

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-bold text-text-secondary mb-1">Content Type</legend>
            {KINDS.map((k) => (
              <label key={k.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="kind"
                  value={k.key}
                  checked={ai.kind === k.key}
                  onChange={() => dispatch(setKind(k.key))}
                  className="accent-accent-lime"
                />
                {k.label}
              </label>
            ))}
          </fieldset>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-text-secondary">Tone</span>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => dispatch(setTone(t))}
                  className={`rounded-pill px-3 py-1.5 text-xs font-bold uppercase ${
                    ai.tone === t ? 'bg-white text-text-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-text-secondary">Length</span>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => dispatch(setLength(l.key))}
                  className={`rounded-pill px-3 py-1.5 text-xs font-bold ${
                    ai.length === l.key ? 'bg-white text-text-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label="Custom Prompt (optional)"
            as="textarea"
            rows={3}
            value={ai.customPrompt}
            onChange={(e) => dispatch(setCustomPrompt(e.target.value))}
            placeholder="Add extra context or constraints…"
          />

          <ErrorBanner error={ai.error?.message ? ai.error : null} />

          <PillButton variant="lime" onClick={generate} disabled={!episodeId || ai.isGenerating}>
            {ai.isGenerating ? 'Generating…' : '✨ Generate Script'}
          </PillButton>
        </aside>

        {/* Right: output + chat */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <AIOutputPanel
            loading={ai.isGenerating}
            content={generatedText}
            onRegenerate={generate}
            onSave={() => {/* persist hook-up in S5 */}}
            onEdit={() => dispatch(clearGenerated())}
          />

          <details className="card-dark p-5">
            <summary className="cursor-pointer font-bold">Refine this script…</summary>
            <div className="mt-4 flex flex-col gap-3">
              <ul className="flex flex-col gap-2 max-h-60 overflow-auto">
                {ai.chatHistory.map((m, i) => (
                  <li
                    key={i}
                    className={`rounded-card px-3 py-2 text-sm ${
                      m.role === 'user' ? 'bg-white/5' : 'bg-bg-purple/30'
                    }`}
                  >
                    <strong className="mr-2 capitalize">{m.role}:</strong>
                    {m.content}
                  </li>
                ))}
              </ul>
              <form onSubmit={sendChat} className="flex gap-2">
                <input
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Ask AI to tighten the intro…"
                  aria-label="Refine prompt"
                  className="flex-1 rounded-pill bg-bg-primary border border-white/10 px-4 py-2 text-sm outline-none focus:border-white/30"
                />
                <PillButton type="submit" size="sm" variant="primary">Send</PillButton>
              </form>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
