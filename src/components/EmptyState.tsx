export default function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        &#8377;
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">No payment links found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600">
        {filter === 'All'
          ? 'Get started by creating your first payment link.'
          : `There are no ${filter.toLowerCase()} payment links. Try a different filter.`}
      </p>
    </div>
  );
}
