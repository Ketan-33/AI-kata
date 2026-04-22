const defaults = [
  { name: 'Instagram', href: '#', gradient: 'from-pink-500 via-purple-500 to-indigo-500', glyph: '📸' },
  { name: 'Facebook', href: '#', gradient: 'from-blue-700 to-blue-400', glyph: 'f' },
  { name: 'X', href: '#', gradient: 'from-zinc-700 to-black', glyph: '𝕏' },
];

export default function SocialFollowSection({ items = defaults }) {
  return (
    <section className="bg-bg-purple text-text-dark py-16 md:py-24">
      <div className="max-w-page mx-auto px-6">
        <h2 className="h-section">Follow us</h2>
        <p className="mt-2 text-text-dark/80">
          Behind-the-scenes, drops, and creator tips across our channels.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group block rounded-card overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-bg-deepPurple/40"
              aria-label={`Follow us on ${item.name}`}
            >
              <div
                className={`aspect-[4/3] bg-gradient-to-br ${item.gradient} grid place-items-center text-white text-7xl font-black transition-transform group-hover:scale-[1.02]`}
              >
                <span aria-hidden>{item.glyph}</span>
              </div>
              <div className="bg-text-dark text-white px-5 py-4 flex items-center justify-between">
                <span className="font-bold">{item.name}</span>
                <span aria-hidden>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
