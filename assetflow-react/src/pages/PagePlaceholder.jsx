import Sidebar from "../components/Sidebar";

export default function PagePlaceholder({ title, eyebrow = "AssetFlow" }) {
  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <Sidebar />
      <main className="md:ml-64 min-h-screen p-lg">
        <div className="max-w-max-width mx-auto">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">{eyebrow}</p>
          <h1 className="font-display text-display text-primary leading-tight mt-sm">{title}</h1>
        </div>
      </main>
    </div>
  );
}
