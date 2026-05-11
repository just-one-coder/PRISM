// src/pages/Certificate.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { getContract } from "../lib/contract";
import { generateCertificatePDF } from "../lib/certificate";
import { Button } from "../components/ui/Button";
import { Hash } from "../components/ui/Hash";
import { Download, Shield, CheckCircle } from "lucide-react";

const bgImage = "https://i.pinimg.com/1200x/1c/d3/7f/1cd37fd888688d61aa92a8974cb1de68.jpg"

export default function Certificate() {
  const { certId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch from query param ?hash=
  useEffect(() => {
    const hash = new URLSearchParams(window.location.search).get("hash");
    if (!hash) { setLoading(false); return; }

    (async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          import.meta.env.VITE_ALCHEMY_SEPOLIA_URL
        );
        const contract = getContract(provider);
        const bytes32Hash = ethers.utils.arrayify(hash);
        
        // Fetch the updated struct from the new smart contract
        const record = await contract.getArtworkDetails(bytes32Hash);
        
        setData({
          title: record.title,
          owner: record.owner,
          artistName: record.artistName, // <-- Fetching the new field from the contract
          timestamp: record.timestamp.toNumber(),
          ipfsHash: record.ipfsHash,
          certId: record.certificateId,
          contentHash: hash,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const download = async () => {
    const pdf = await generateCertificatePDF(data);
    pdf.save(`PRISM-Certificate-${data.certId}.pdf`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-ink-muted">
      Certificate not found
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex items-start justify-center">
        <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none -z-10"
            style={{ backgroundImage: `url('${bgImage}')` }}
        />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Certificate preview */}
        <div className="bg-surface-1 border border-accent/20 rounded-2xl overflow-hidden mb-5">
          {/* Gold top bar */}
          <div className="h-1 bg-accent" />
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={14} className="text-accent" />
              <span className="text-xs font-mono text-accent tracking-widest">PRISM CERTIFICATE OF OWNERSHIP</span>
            </div>

            <h1 className="font-display text-3xl font-bold text-ink mb-1">"{data.title}"</h1>
            <p className="text-sm text-ink-muted mb-8">Registered on the Ethereum Sepolia Network</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-ink-faint mb-1.5">Registered Creator</p>
                {/* Displaying the artist name prominently */}
                <p className="text-lg font-display font-semibold text-accent mb-1">
                  {data.artistName}
                </p>
                <Hash value={data.owner} chars={10} />
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1.5">Registration Date</p>
                <p className="text-sm text-ink font-body">
                  {new Date(data.timestamp * 1000).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="bg-surface-2 border border-border rounded-xl p-4 mb-6">
              <p className="text-xs text-ink-faint mb-1.5">SHA-256 Content Hash</p>
              <p className="font-mono text-xs text-ink-muted break-all">{data.contentHash}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-faint mb-1">Certificate ID</p>
                <p className="font-mono text-sm text-accent font-semibold">{data.certId}</p>
              </div>
              <div className="flex items-center gap-1.5 text-verified text-xs">
                <CheckCircle size={14} />
                Verified on-chain
              </div>
            </div>
          </div>
        </div>

        <Button onClick={download} size="lg" className="w-full">
          <Download size={16} />
          Download PDF Certificate
        </Button>
      </motion.div>
    </div>
  );
}