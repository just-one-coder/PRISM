import { clsx } from "clsx";

const colors = {
  verified: "bg-verified",
  pending: "bg-pending",
  danger: "bg-danger",
  accent: "bg-accent",
  muted: "bg-ink-faint",
};

export function StatusDot({ status = "muted", pulse = false, className }) {
  return (
    <span
      className={clsx(
        "inline-block w-2 h-2 rounded-full flex-shrink-0",
        colors[status],
        pulse && "animate-pulse",
        className
      )}
    />
  );
}