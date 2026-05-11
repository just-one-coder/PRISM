import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button"; // Adjust path if needed
import bgImage from "../assets/bgImage2.jpg"
import { 
  ArrowRight, Shield, Zap, Globe, Lock, 
  Sparkles, Award 
} from "lucide-react";

export default function Home() {
  // --- Hooks and State (Moved INSIDE the component) ---
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [currentFeature, setCurrentFeature] = useState(0);

  const words = ['Digital Art', 'NFTs', 'Creations', 'Intellectual Property'];
  const heroBgImage = 'https://i.pinimg.com/1200x/e0/d2/5c/e0d25c0b4519b5f5de3e987158e040c2.jpg';
  const heroBgImage2 = 'https://i.pinimg.com/736x/ad/08/1c/ad081ce1f8037a80ba08bcbeeefdead7.jpg';
// `url(${bgImage})`
  // Typing effect
  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];
      
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(75);
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [displayText, isDeleting, currentWordIndex, words]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.getElementById('parallax-bg');
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-cycle features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- Data Arrays ---
  const stats = [
    { label: "Registration Time", value: "~2 min" },
    { label: "Verification Speed", value: "<3 sec" },
    { label: "Storage", value: "Permanent" },
    { label: "Fraud Guarantee", value: "Zero" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Immutable Proof",
      description: "SHA-256 content hashing + Ethereum timestamping creates court-admissible proof of creation.",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Verify or Register any artwork under 2 minutes. Upload, hash, store on IPFS, register on-chain. No lawyers.",
    },
    {
      icon: Globe,
      title: "Global Registry",
      description: "Decentralized network of verified artworks from creators worldwide, accessible anywhere.",
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "IPFS storage via Pinata ensures your artwork exists permanently, tamper-proof and globally distributed.",
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload Your Art",
      description: "Simply upload your digital artwork to our secure platform"
    },
    {
      step: "02",
      title: "Blockchain Registration",
      description: "We timestamp your creation on the Ethereum blockchain"
    },
    {
      step: "03",
      title: "Get Your Certificate",
      description: "Receive a permanent certificate of authenticity"
    },
    {
      step: "04",
      title: "Verify Anywhere",
      description: "Anyone can verify your artwork's authenticity instantly"
    }
  ];

  return (
    <div className="min-h-screen bg-mesh">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Parallax Background adapted for new theme (subtle opacity) */}
        <div 
          id="parallax-bg"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 mix-blend-screen pointer-events-none transition-transform duration-0"
          style={{ backgroundImage: `url('${heroBgImage}')` }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-mono text-accent mb-8">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Ethereum Sepolia · IPFS · Open Protocol
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-ink leading-[1.05] mb-6"
          >
            Protect Your
            <br />
            <span className="block text-accent min-h-[1.2em]">
              {displayText}
              <span className="ml-1 animate-pulse font-light text-ink-muted">|</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-ink-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          >
            PRISM registers digital artworks on the Ethereum blockchain in under two minutes. 
            Immutable timestamps. Zero-fraud ownership certificates. No intermediaries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Register Artwork
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/verify">
              <Button size="lg" variant="ghost">
                Verify Authenticity
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="border-y border-border bg-surface-1/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="px-8 py-4 text-center first:pl-0 last:pr-0"
            >
              <div className="font-display text-2xl font-bold text-ink mb-1">{s.value}</div>
              <div className="text-xs text-ink-faint font-body">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-ink mb-4">
            Why Choose PRISM?
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto font-body">
            Comprehensive protection for your digital creativity using cutting-edge blockchain technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                currentFeature === i 
                  ? 'bg-accent/5 border-accent scale-[1.02] shadow-sm' 
                  : 'bg-surface-1 border-border hover:border-accent/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                currentFeature === i 
                  ? 'bg-accent text-surface' 
                  : 'bg-accent/10 border border-accent/20 text-accent'
              }`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-ink mb-2 text-lg">{f.title}</h3>
              {/* FIX: Changed f.desc to f.description to match array */}
              <p className="text-sm text-ink-muted leading-relaxed font-body">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (Ported & Re-styled) --- */}
      <section className="py-24 bg-surface-2 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-ink mb-4">
              How It Works
            </h2>
            <p className="text-lg text-ink-muted max-w-2xl mx-auto font-body">
              Get started in minutes with our simple, transparent process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group relative">
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-border border-dashed pointer-events-none" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-surface-1 border border-border text-accent flex items-center justify-center text-xl font-display font-bold mb-6 mx-auto group-hover:bg-accent group-hover:text-surface group-hover:border-accent transition-all duration-300 shadow-sm">
                  {step.step}
                </div>
                <h3 className="font-display font-semibold text-ink mb-3 text-lg">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (Ported & Re-styled) --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Parallax Background adapted for new theme (subtle opacity) */}
        <div 
          id="parallax-bg"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20 mix-blend-screen pointer-events-none transition-transform duration-0"
          style={{ backgroundImage: `url('${heroBgImage2}')` }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-surface-1 rounded-[2rem] p-10 md:p-16 border-2 bg-black border-border shadow-lg">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
              Ready to Protect Your Art?
            </h2>
            <p className="text-lg text-ink-muted mb-10 max-w-xl mx-auto font-body">
              Join thousands of artists who trust PRISM to protect their digital creations with permanent blockchain records.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Shield size={18} />
                  Register Your Artwork
                </Button>
              </Link>
              <Link to="/verify">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto border border-border hover:border-accent/30">
                  Verify Artwork
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}