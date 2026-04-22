export default function StatCard({ icon, title, value, trend, className = '' }) {
  const positive = typeof trend === 'string' && trend.trim().startsWith('+');
  return (
    <div className={`card-dark p-6 border border-white/5 ${className}`}>
      <div className="flex items-center justify-between text-text-secondary text-sm">
        <span className="uppercase tracking-wide">{title}</span>
        {icon && <span aria-hidden className="text-xl">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-4xl md:text-5xl font-black tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-sm font-bold ${positive ? 'text-accent-green' : 'text-text-secondary'}`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
