import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { getContract, getPublicProvider } from "../lib/contract";
import { Badge } from "../components/ui/Badge";
import { Hash } from "../components/ui/Hash";
import { Search, Grid3X3, List, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const bgImage = "https://i.pinimg.com/1200x/97/11/47/971147b610292758935e9f2b91ffd77f.jpg"

function ArtworkCard({ record, index, view }) {
  const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`;
  const date = new Date(record.timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04 }}
        className="flex items-center gap-4 p-4 bg-surface-1 border border-border rounded-xl hover:border-accent/20 transition-all"
      >
        <img
          src={ipfsGateway}
          alt={record.title}
          className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0 bg-surface-2"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-semibold text-ink truncate mb-0.5">
            {record.title}
          </p>
          <Hash value={record.owner} chars={8} />
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-ink-faint">{date}</span>
          <Badge variant="verified">
            <CheckCircle size={9} />
            Verified
          </Badge>
          <Link
            to={`/certificate?hash=${record.contentHashHex}`}
            className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-faint hover:text-ink transition-colors"
          >
            <ExternalLink size={14} />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group bg-surface-1 border border-border rounded-2xl overflow-hidden hover:border-accent/20 transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-square bg-surface-2 overflow-hidden relative">
        <img
          src={ipfsGateway}
          alt={record.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full flex items-center justify-center">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-surface-4">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 5-5 5 5 4-4 4 4"/>
                </svg>
              </div>
            `;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/certificate?hash=${record.contentHashHex}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-surface/80 backdrop-blur-sm border border-border rounded-lg text-xs font-body text-ink hover:bg-accent hover:text-surface hover:border-accent transition-all"
          >
            <CheckCircle size={11} />
            View Certificate
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm font-display font-semibold text-ink truncate mb-1">
          {record.title || "Untitled"}
        </p>
        {record.description && (
          <p className="text-xs text-ink-faint line-clamp-2 mb-2 leading-relaxed">
            {record.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <Hash value={record.owner} chars={6} />
          <span className="text-xs text-ink-faint">{date}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden">
      <div className="aspect-square bg-surface-2 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3.5 bg-surface-2 rounded-lg animate-pulse w-3/4" />
        <div className="h-3 bg-surface-2 rounded-lg animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const provider = getPublicProvider();
      const contract = getContract(provider);

      const hashes = await contract.getAllArtworks();
      if (hashes.length === 0) {
        setArtworks([]);
        return;
      }

      // Fetch details for all artworks in parallel
      const details = await Promise.all(
        hashes.map(async (hash) => {
          try {
            const record = await contract.getArtworkDetails(hash);
            return {
              owner: record.owner,
              ipfsHash: record.ipfsHash,
              contentHashHex: ethers.utils.hexlify(hash),
              timestamp: record.timestamp.toNumber(),
              title: record.title,
              description: record.description,
              certId: record.certificateId,
            };
          } catch {
            return null;
          }
        })
      );

      // Filter nulls and sort newest first
      const valid = details
        .filter(Boolean)
        .sort((a, b) => b.timestamp - a.timestamp);

      setArtworks(valid);
    } catch (err) {
      console.error("Gallery fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const filtered = artworks.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.owner.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center opacity-15 mix-blend-screen pointer-events-none -z-10"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-ink mb-1">Art Gallery</h1>
            <p className="text-ink-muted text-sm">
              {loading ? "Loading…" : `${artworks.length} registered artwork${artworks.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title or address…"
                className="pl-9 pr-4 py-2 bg-surface-1 border border-border rounded-xl text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-accent/40 transition-colors w-56"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-surface-1 border border-border rounded-xl p-1 gap-1">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-surface-2 text-ink" : "text-ink-faint hover:text-ink-muted"}`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-surface-2 text-ink" : "text-ink-faint hover:text-ink-muted"}`}
              >
                <List size={15} />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchArtworks}
              className="p-2 bg-surface-1 border border-border rounded-xl text-ink-faint hover:text-ink hover:border-accent/30 transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </motion.div>

        {/* Grid / List */}
        {loading ? (
          <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" : "space-y-3"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-surface-1 border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-ink-faint" />
            </div>
            <p className="text-ink-muted font-body mb-1">
              {query ? "No artworks match your search" : "No artworks registered yet"}
            </p>
            <p className="text-xs text-ink-faint">
              {!query && <Link to="/register" className="text-accent hover:underline">Be the first to register</Link>}
            </p>
          </div>
        ) : (
          <div className={
            view === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              : "space-y-3"
          }>
            {filtered.map((art, i) => (
              <ArtworkCard key={art.contentHashHex} record={art} index={i} view={view} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}