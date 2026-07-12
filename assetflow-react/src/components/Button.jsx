export default function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-primary px-md py-sm font-label-md text-label-md font-bold text-white transition-colors hover:bg-primary-container ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
