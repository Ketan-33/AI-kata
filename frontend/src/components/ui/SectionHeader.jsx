export default function SectionHeader({ title, subtitle, cta, tone = 'dark' }) {
  const isLight = tone === 'light';
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h2 className={`h-section ${isLight ? 'text-text-dark' : 'text-text-primary'}`}>{title}</h2>
        {subtitle && (
          <p className={`mt-2 text-base md:text-lg ${isLight ? 'text-text-dark/80' : 'text-text-secondary'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {cta && <div className="shrink-0">{cta}</div>}
    </header>
  );
}
