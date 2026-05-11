import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useWallet } from "../../context/WalletContext";
import { Button } from "../ui/Button";
import { Wallet, Shield } from "lucide-react";

const links = [
  { label: "Gallery", to: "/gallery" },
  { label: "Register", to: "/register" },
  { label: "Verify", to: "/verify" },
  { label: "Dashboard", to: "/dashboard" },
];

export function Navbar() {
  const { account, connect, disconnect } = useWallet();
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-xl border-b border-border" />
      <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="font-bold font-display text-lg text-black">P</span>
          </div>
          <div>
              <h1 className="text-sm font-display font-bold tracking-tight">
                PRISM
              </h1>
              <p className="text-xs font-display">
                Plagiarism Resistant Integrity System for Media
              </p>
            </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-4 py-2 text-sm font-body text-ink-muted hover:text-ink transition-colors"
            >
              {pathname === link.to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-surface-2 rounded-lg border border-border"
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Wallet */}
        {account ? (
          <button
            onClick={disconnect}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border rounded-xl text-sm font-mono text-ink-muted hover:border-danger/30 hover:text-danger transition-all"
          >
            <span className="w-2 h-2 bg-verified rounded-full animate-pulse" />
            {account.slice(0, 6)}…{account.slice(-4)}
          </button>
        ) : (
          <Button onClick={connect} size="sm">
            <Wallet size={14} />
            Connect
          </Button>
        )}
      </div>
    </header>
  );
}