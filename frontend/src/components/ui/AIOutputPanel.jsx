import { useState } from 'react';
import PillButton from './PillButton.jsx';

export default function AIOutputPanel({
  loading = false,
  content = '',
  onCopy,
  onSave,
  onRegenerate,
  onEdit,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      onCopy?.();
    } catch {
      /* ignore clipboard failure */
    }
  };

  return (
    <section className="card-dark p-6 flex flex-col gap-4 min-h-[480px]" aria-live="polite">
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">Generated content</h3>
        <div className="flex flex-wrap gap-2">
          <PillButton variant="outline" size="sm" onClick={handleCopy} disabled={!content}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </PillButton>
          <PillButton variant="outline" size="sm" onClick={onSave} disabled={!content}>
            💾 Save
          </PillButton>
          <PillButton variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            🔄 Regenerate
          </PillButton>
          <PillButton variant="outline" size="sm" onClick={onEdit} disabled={!content}>
            ✏️ Edit
          </PillButton>
        </div>
      </header>

      {loading && (
        <div className="space-y-3" aria-label="Generating script">
          <div className="pulse-skeleton h-6 w-2/3" />
          <div className="pulse-skeleton h-4 w-full" />
          <div className="pulse-skeleton h-4 w-11/12" />
          <div className="pulse-skeleton h-4 w-9/12" />
          <div className="pulse-skeleton h-32 w-full" />
        </div>
      )}

      {!loading && !content && (
        <p className="text-text-secondary">
          Configure the prompt on the left and click <strong>Generate</strong> to draft your script.
        </p>
      )}

      {!loading && content && (
        <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-text-primary">
          {content}
        </pre>
      )}
    </section>
  );
}
