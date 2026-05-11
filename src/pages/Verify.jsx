import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { getContract, getPublicProvider } from "../lib/contract";
import { hashFile } from "../lib/hash";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Hash } from "../components/ui/Hash";
import {
  Upload, CheckCircle, XCircle, Search,
  FileImage, ExternalLink, Award
} from "lucide-react";
import { Link } from "react-router-dom";

const bgImage = "https://i.pinimg.com/1200x/20/ad/0a/20ad0a3ad711f58769b011cbb7e9f2f7.jpg"

export default function Verify() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | found | notfound | error
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [contentHashHex, setContentHashHex] = useState(null);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
    setResult(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleVerify = async () => {
    if (!file) return;
    setStatus("loading");

    try {
      const hexHash = await hashFile(file);
      setContentHashHex(hexHash);

      const provider = getPublicProvider();
      const contract = getContract(provider);

      const bytes32Hash = ethers.utils.arrayify(hexHash);

      try {
        const [owner, timestamp, title, ipfsHash, certId] =
          await contract.verifyArtwork(bytes32Hash);

        setResult({
          owner,
          timestamp: timestamp.toNumber(),
          title,
          ipfsHash,
          certId,
          contentHash: hexHash,
        });
        setStatus("found");
      } catch (contractErr) {
        // Contract reverted = not registered
        setStatus("notfound");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-mesh">
        <div 
             className="fixed inset-0 w-full h-full bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none -z-10"
             style={{ backgroundImage: `url('${bgImage}')` }}
        />
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Search size={16} className="text-accent" />
            <span className="text-xs font-mono text-accent tracking-wider">VERIFY</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-ink mb-2">
            Verify Authenticity
          </h1>
          <p className="text-ink-muted mb-8 text-sm leading-relaxed">
            Upload any digital artwork to instantly check if it's registered on the blockchain.
            No wallet required.
          </p>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !file && document.getElementById("verify-input").click()}
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
            dragging
              ? "border-accent bg-accent/5 scale-[1.01]"
              : file
              ? "border-surface-3 bg-surface-1 cursor-default"
              : "border-border bg-surface-1 hover:border-accent/30 cursor-pointer"
          }`}
        >
          <input
            id="verify-input"
            type="file"
            accept="image/*,video/*,audio/*,.gif,.webp"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="p-6">
              <div className="flex items-start gap-5">
                {preview && (
                  <img
                    src={preview}
                    alt="artwork"
                    className="w-28 h-28 object-cover rounded-xl border border-border flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-body text-ink font-medium truncate mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-ink-faint mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleVerify}
                      disabled={status === "loading"}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-surface text-sm font-display font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                          Verifying…
                        </>
                      ) : (
                        <>
                          <Search size={14} />
                          Check on Blockchain
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setStatus("idle");
                        setResult(null);
                        document.getElementById("verify-input").click();
                      }}
                      className="px-4 py-2 border border-border text-ink-muted text-sm rounded-xl hover:border-accent/30 transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 bg-surface-2 border border-border rounded-2xl flex items-center justify-center mb-1">
                <FileImage size={22} className="text-ink-muted" />
              </div>
              <p className="text-sm text-ink font-body">Drop artwork to verify</p>
              <p className="text-xs text-ink-faint">
                Any digital file — the SHA-256 hash is computed locally, nothing is uploaded
              </p>
            </div>
          )}
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {status === "found" && result && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5"
            >
              <Card className="overflow-hidden">
                {/* Green top bar */}
                <div className="h-0.5 bg-verified" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-verified/10 border border-verified/20 rounded-xl flex items-center justify-center">
                        <CheckCircle size={18} className="text-verified" />
                      </div>
                      <div>
                        <p className="text-sm font-display font-semibold text-ink">
                          Verified Original
                        </p>
                        <p className="text-xs text-ink-faint">
                          Registered on Ethereum
                        </p>
                      </div>
                    </div>
                    <Badge variant="verified">
                      <CheckCircle size={10} />
                      On-chain
                    </Badge>
                  </div>

                  <div className="space-y-0 divide-y divide-border">
                    {[
                      {
                        label: "Title",
                        value: result.title,
                        mono: false,
                      },
                      {
                        label: "Registered Owner",
                        value: result.owner,
                        mono: true,
                        isHash: true,
                      },
                      {
                        label: "Registration Date",
                        value: new Date(result.timestamp * 1000).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        mono: false,
                      },
                      {
                        label: "Certificate ID",
                        value: result.certId,
                        mono: true,
                        accent: true,
                      },
                    ].map(({ label, value, mono, isHash, accent }) => (
                      <div key={label} className="flex items-start justify-between gap-4 py-3">
                        <span className="text-xs text-ink-faint flex-shrink-0 pt-0.5">
                          {label}
                        </span>
                        {isHash ? (
                          <Hash value={value} chars={12} />
                        ) : (
                          <span
                            className={`text-xs text-right break-all ${
                              mono ? "font-mono" : "font-body"
                            } ${accent ? "text-accent font-semibold" : "text-ink-muted"}`}
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link
                      to={`/certificate?hash=${contentHashHex}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-ink-muted hover:border-accent/30 hover:text-ink transition-all"
                    >
                      <Award size={14} />
                      View Certificate
                    </Link>
                    <a
                      href={`https://ipfs.io/ipfs/${result.ipfsHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-ink-muted hover:border-accent/30 hover:text-ink transition-all"
                    >
                      <ExternalLink size={14} />
                      IPFS
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {status === "notfound" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <Card className="overflow-hidden">
                <div className="h-0.5 bg-danger" />
                <div className="p-6 flex items-start gap-4">
                  <div className="w-9 h-9 bg-danger/10 border border-danger/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle size={18} className="text-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-ink mb-1">
                      Not Registered
                    </p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      This file has no record on the PRISM registry. It may be unregistered,
                      or a copy of an original. To register your work,{" "}
                      <Link to="/register" className="text-accent hover:underline">
                        click here
                      </Link>.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-5 bg-surface-1 border border-border rounded-2xl"
        >
          <p className="text-xs font-body text-ink-faint mb-3 uppercase tracking-wider">
            How verification works
          </p>
          <div className="space-y-2">
            {[
              "Your file is hashed locally using SHA-256 — it never leaves your device",
              "The hash is used to query the Ethereum smart contract directly",
              "If a matching record exists, ownership details are returned from the blockchain",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-surface-2 border border-border text-xs text-ink-faint flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-ink-muted leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}