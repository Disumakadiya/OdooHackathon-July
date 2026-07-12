import Sidebar from "../components/Sidebar";

export default function PagePlaceholder({ eyebrow, title }) {
  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-outline-variant bg-surface p-8">
          <p className="text-sm uppercase tracking-wide text-outline">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-primary">{title}</h1>
          <p className="mt-4 text-on-surface-variant">
            This screen is scaffolded and ready for implementation.
          </p>
        </div>
      </main>
    </div>
  );
}
