import { clsx } from "clsx";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        "bg-surface-1 border border-border rounded-2xl",
        hover && "hover:border-accent/20 hover:bg-surface-2 transition-all duration-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}