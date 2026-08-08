export default function Navbar({ title = "AssetFlow" }) {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant px-lg py-sm">
      <h1 className="font-headline-md text-headline-md text-primary font-bold">{title}</h1>
    </header>
  );
}
