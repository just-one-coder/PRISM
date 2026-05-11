import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-border pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <span className="font-display font-bold text-surface text-lg">P</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-ink tracking-tight">PRISM</h3>
                  <p className="text-ink-faint text-xs font-mono tracking-wider">Plagiarism Resistant Integrity System for Media</p>
                </div>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed max-w-sm font-body">
                Protecting digital creativity through blockchain technology. 
                Timestamp, verify, and secure your artwork with immutable proof.
              </p>
            </div>

            <div>
              <h4 className="text-ink font-display font-semibold mb-5">Platform</h4>
              <ul className="space-y-3 font-body text-sm">
                <li><Link to="/" className="text-ink-muted hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/gallery" className="text-ink-muted hover:text-accent transition-colors">Gallery</Link></li>
                <li><Link to="/register" className="text-ink-muted hover:text-accent transition-colors">Register Art</Link></li>
                <li><Link to="/verify" className="text-ink-muted hover:text-accent transition-colors">Verify Art</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-ink font-display font-semibold mb-5">Resources</h4>
              <ul className="space-y-3 font-body text-sm">
                <li><a href="#" className="text-ink-muted hover:text-accent transition-colors">Documentation</a></li>
                <li><a href="#" className="text-ink-muted hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="text-ink-muted hover:text-accent transition-colors">Smart Contract</a></li>
                <li><a href="#" className="text-ink-muted hover:text-accent transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ink-faint text-sm font-body">
              © {new Date().getFullYear()} PRISM Protocol. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm font-body">
              <a href="#" className="text-ink-faint hover:text-ink transition-colors">Terms</a>
              <a href="#" className="text-ink-faint hover:text-ink transition-colors">Privacy</a>
              <a href="#" className="text-ink-faint hover:text-ink transition-colors">Cookies</a>
            </div>
          </div>
        </div>
    </footer>
  );
}