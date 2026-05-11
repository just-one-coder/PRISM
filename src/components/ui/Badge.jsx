import { clsx } from "clsx";

const variants = {
  verified: "bg-verified/10 border-verified/20 text-verified",
  pending: "bg-pending/10 border-pending/20 text-pending",
  danger: "bg-danger/10 border-danger/20 text-danger",
  accent: "bg-accent/10 border-accent/20 text-accent",
  default: "bg-surface-2 border-border text-ink-muted",
};

export function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}