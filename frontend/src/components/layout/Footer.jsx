const Footer = () => (
  <footer className="mt-20 border-t border-brand-cocoa/10 bg-white/70">
    <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
      <div>
        <h3 className="font-display text-2xl">NR Dry Fruit</h3>
        <p className="mt-3 text-sm text-brand-cocoa/70">
          Premium dry fruits, festive assortments, and nourishing snacks crafted for daily indulgence.
        </p>
      </div>
      <div>
        <h4 className="font-semibold">Highlights</h4>
        <ul className="mt-3 space-y-2 text-sm text-brand-cocoa/70">
          <li>Freshly packed premium nuts</li>
          <li>Online payment + cash on delivery</li>
          <li>Fast support and order tracking</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">Hours</h4>
        <p className="mt-3 text-sm text-brand-cocoa/70">Mon-Sat: 9:00 AM to 8:30 PM</p>
        <p className="text-sm text-brand-cocoa/70">Sun: 10:00 AM to 5:00 PM</p>
      </div>
    </div>
  </footer>
);

export default Footer;
