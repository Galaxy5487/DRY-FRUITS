const EmptyState = ({ title, description, action }) => (
  <div className="card-surface p-10 text-center">
    <h3 className="font-display text-2xl">{title}</h3>
    <p className="mt-3 text-brand-cocoa/70">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
