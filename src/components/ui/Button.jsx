import { clsx } from "clsx";

export function Button({ children, variant = "primary", size = "md", className, loading, ...props }) {
  const base = "inline-flex items-center justify-center font-display font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-surface hover:bg-accent/90 active:scale-[0.98]",
    ghost: "border border-border text-ink hover:bg-surface-2 hover:border-accent/30",
    danger: "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  );
}