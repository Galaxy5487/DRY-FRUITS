const Loader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[180px] items-center justify-center text-sm text-brand-cocoa/70">
    {label}
  </div>
);

export default Loader;
