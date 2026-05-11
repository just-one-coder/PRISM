import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function Hash({ value, chars = 8 }) {
  const [copied, setCopied] = useState(false);
  const short = value ? `${value.slice(0, chars + 2)}...${value.slice(-4)}` : "—";

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-accent transition-colors"
    >
      {short}
      {copied ? <Check size={12} className="text-verified" /> : <Copy size={12} />}
    </button>
  );
}