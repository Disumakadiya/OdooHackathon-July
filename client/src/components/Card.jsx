export default function Card({ children, className = "", title, subtitle, headerAction }) {
  return (
    <section className={`rounded-lg border border-outline-variant bg-surface-container-lowest p-lg soft-elevation ${className}`}>
      {title ? (
        <header className="mb-md flex items-start justify-between gap-md">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">{title}</h3>
            {subtitle ? <p className="mt-xs font-label-md text-label-md text-on-surface-variant">{subtitle}</p> : null}
          </div>
          {headerAction ? <div>{headerAction}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
