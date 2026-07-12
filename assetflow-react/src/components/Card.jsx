export default function Card({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-outline-variant bg-surface-container-lowest p-lg soft-elevation ${className}`}>
      {children}
    </section>
  );
}
