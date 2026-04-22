import { useState } from 'react';

export default function TagInput({ value = [], onChange, placeholder = 'Add tag and press Enter' }) {
  const [draft, setDraft] = useState('');

  const add = (raw) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange?.([...value, tag]);
    setDraft('');
  };

  const remove = (tag) => onChange?.(value.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="bg-bg-secondary rounded-card border border-white/10 px-3 py-2 flex flex-wrap gap-2 focus-within:border-white/30">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            aria-label={`Remove tag ${tag}`}
            className="text-text-secondary hover:text-white"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft && add(draft)}
        placeholder={value.length ? '' : placeholder}
        className="flex-1 min-w-[140px] bg-transparent outline-none py-1 text-sm"
        aria-label="Tag input"
      />
    </div>
  );
}
