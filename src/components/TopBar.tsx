export default function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540] lg:hidden">{"\u2630"}</button>
        <nav aria-label="Breadcrumb" className="min-w-0 text-[13px] text-neutral-500"><span>Home</span><span aria-hidden="true"> / </span><span className="font-medium text-black">Payment Links</span></nav>
        <div className="ml-auto hidden sm:block" role="search"><input type="search" placeholder="Search links..." aria-label="Search payment links" className="w-52 rounded-lg border border-neutral-200 bg-[#f4f4f4] px-3 py-1.5 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] lg:w-64" /></div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 sm:ml-0"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>
      </div>
    </header>
  );
}
