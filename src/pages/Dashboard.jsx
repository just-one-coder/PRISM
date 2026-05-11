import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { getContract, getPublicProvider } from "../lib/contract";
import { useWallet } from "../context/WalletContext";
import { Badge } from "../components/ui/Badge";
import { Hash } from "../components/ui/Hash";
import { Button } from "../components/ui/Button";
import {
  Wallet, Image as ImageIcon, Clock, Award,
  ExternalLink, Plus, BarChart2
} from "lucide-react";

const bgImage = "https://i.pinimg.com/1200x/8e/29/6e/8e296eb8c10259b605c94de7af1b7c21.jpg";

function ArtworkRow({ record, index }) {
  const date = new Date(record.timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
  const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-4 p-4 bg-surface-1 border border-border rounded-xl hover:border-accent/20 transition-all group"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-surface-2 border border-border overflow-hidden flex-shrink-0">
        <img
          src={ipfsGateway}
          alt={record.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.opacity = "0"; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-semibold text-ink truncate mb-0.5">
          {record.title}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-faint">{date}</span>
          <span className="font-mono text-xs text-ink-faint/60 truncate max-w-[120px] hidden md:block">
            {record.certId}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/certificate?hash=${record.contentHashHex}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border rounded-lg text-xs text-ink-muted hover:border-accent/30 hover:text-ink transition-all"
        >
          <Award size={12} />
          Certificate
        </Link>
        <a
          href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 bg-surface-2 border border-border rounded-lg text-ink-faint hover:text-ink transition-colors"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { account, connect } = useWallet();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    (async () => {
      setLoading(true);
      try {
        const provider = getPublicProvider();
        const contract = getContract(provider);

        const hashes = await contract.getUserArtworks(account);
        if (hashes.length === 0) { setArtworks([]); return; }

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
            } catch { return null; }
          })
        );

        setArtworks(
          details.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [account]);

  // Stats
  const firstRegistration = artworks.length
    ? new Date(Math.min(...artworks.map((a) => a.timestamp)) * 1000).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  const stats = [
    { icon: ImageIcon, label: "Total Artworks", value: artworks.length },
    { icon: Clock, label: "First Registration", value: firstRegistration },
    { icon: Award, label: "Certificates", value: artworks.length },
    { icon: BarChart2, label: "Network", value: "Sepolia" },
  ];

  if (!account) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 bg-surface-1 border border-border rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Wallet size={24} className="text-ink-muted" />
          </div>
          <h2 className="font-display font-bold text-xl text-ink mb-2">
            Connect your wallet
          </h2>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            Connect MetaMask to view your registered artworks and download certificates.
          </p>
          <Button onClick={connect} size="lg">
            <Wallet size={15} />
            Connect MetaMask
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
        <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none -z-10"
            style={{ backgroundImage: `url('${bgImage}')` }}
        />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-5xl font-bold text-ink mb-1">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint">Connected as</span>
            <Hash value={account} chars={10} />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-surface-1 border border-border rounded-2xl p-5"
            >
              <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mb-3">
                <s.icon size={15} className="text-accent" />
              </div>
              <p className="font-display font-bold text-xl text-ink mb-0.5">
                {loading ? (
                  <span className="inline-block w-8 h-5 bg-surface-2 animate-pulse rounded" />
                ) : s.value}
              </p>
              <p className="text-xs text-ink-faint">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Artworks list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">My Artworks</h2>
            <Link to="/register">
              <Button size="sm" variant="ghost">
                <Plus size={13} />
                Register New
              </Button>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loading" className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-surface-1 border border-border rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : artworks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-surface-1 border border-border rounded-2xl"
              >
                <ImageIcon size={32} className="text-ink-faint mx-auto mb-3" />
                <p className="text-ink-muted text-sm mb-1">No artworks registered yet</p>
                <p className="text-xs text-ink-faint mb-5">
                  Register your first artwork to get started
                </p>
                <Link to="/register">
                  <Button size="sm">
                    <Plus size={13} />
                    Register Artwork
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3">
                {artworks.map((art, i) => (
                  <ArtworkRow key={art.contentHashHex} record={art} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}