const mainNav = [
  { label: "Dashboard", icon: "▦", active: false },
  { label: "Payment Links", icon: "🔗", active: true },
  { label: "Payments", icon: "₹", active: false },
  { label: "Customers", icon: "○", active: false },
];
const manageNav = [
  { label: "Reports", icon: "▤", active: false },
  { label: "Settings", icon: "⚙", active: false },
];
export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[248px] -translate-x-full flex-col bg-black text-white transition-transform lg:static lg:z-auto lg:translate-x-0 ${open ? "translate-x-0" : ""}`} aria-label="Sidebar">
        <div className="flex items-center gap-2.5 px-5 pb-5 pt-5">
          <div aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a2540] text-base font-bold ring-1 ring-white/20">R</div>
          <div>
            <p className="text-[15px] font-bold leading-none">Razorpay</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/50">Merchant</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close sidebar" className="ml-auto rounded p-1.5 text-white/60 hover:bg-white/10 lg:hidden">✕</button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3" aria-label="Dashboard">
          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Overview</p>
            <ul className="space-y-1">
              {mainNav.map((n) => (
                <li key={n.label}>
                  <a href="#main-content" aria-current={n.active ? "page" : undefined} onClick={(e) => { if (!n.active) e.preventDefault(); }} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${n.active ? "bg-[#0a2540] text-white shadow-sm" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
                    <span aria-hidden="true" className="w-5 text-center">{n.icon}</span>{n.label}
                    {n.active && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Manage</p>
            <ul className="space-y-1">
              {manageNav.map((n) => (
                <li key={n.label}>
                  <a href="#main-content" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/65 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <span aria-hidden="true" className="w-5 text-center">{n.icon}</span>{n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="p-3">
          <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
            <p className="text-xs font-bold">Need help?</p>
            <p className="mt-0.5 text-xs text-white/60">Docs and API reference</p>
          </div>
          <div className="mt-3 flex items-center gap-2.5 px-1 py-1">
            <div aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black">A</div>
            <div className="min-w-0"><p className="truncate text-[13px] font-medium">Merchant Admin</p><p className="truncate text-xs text-white/50">admin@store.in</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}
