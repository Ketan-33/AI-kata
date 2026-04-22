export default function EmptyState({ icon = '✨', title, description, action }) {
  return (
    <div className="card-dark p-10 text-center flex flex-col items-center gap-3">
      <div className="text-5xl" aria-hidden>{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="text-text-secondary max-w-md">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
