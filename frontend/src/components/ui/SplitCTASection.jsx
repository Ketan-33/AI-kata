import PillButton from './PillButton.jsx';
import { Link } from 'react-router-dom';

export default function SplitCTASection({ left, right }) {
  return (
    <section className="bg-bg-deepPurple py-16 md:py-24">
      <div className="max-w-page mx-auto px-6 grid md:grid-cols-2 gap-6">
        {[left, right].map((c, idx) => (
          <article
            key={idx}
            className="rounded-card p-8 md:p-10 bg-bg-secondary border-2 border-accent-lime/60 flex flex-col gap-6 min-h-[280px]"
          >
            <div className="text-5xl" aria-hidden>{c.icon}</div>
            <h3 className="text-2xl md:text-3xl font-black leading-tight">{c.title}</h3>
            {c.description && (
              <p className="text-text-secondary">{c.description}</p>
            )}
            <div className="mt-auto">
              <PillButton as={Link} to={c.href} variant="lime">
                {c.ctaLabel} →
              </PillButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
