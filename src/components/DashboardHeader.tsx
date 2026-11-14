export default function DashboardHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Payment Links</h1>
        <p className="mt-1 max-w-xl text-sm text-slate-600">
          Create shareable payment links and track collections. Links expire automatically after their expiry date.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        + Create Payment Link
      </button>
    </div>
  );
}
