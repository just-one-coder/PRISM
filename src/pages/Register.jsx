// src/pages/Register.jsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useWallet } from "../context/WalletContext";
import { getContract } from "../lib/contract";
import { hashFile } from "../lib/hash";
import { uploadToIPFS } from "../lib/ipfs";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Upload, CheckCircle, AlertCircle, ArrowRight, FileImage } from "lucide-react";

const bgImage = "https://i.pinimg.com/1200x/4d/38/cb/4d38cbc82e286d4ca8038bd624c68e5a.jpg"

const STEPS = ["Upload", "Hash & Store", "Register", "Certificate"];

export default function Register() {
    const [artistName, setArtistName] = useState("");
    const { signer, account, connect } = useWallet();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [step, setStep] = useState(0); // 0=idle, 1=hashing, 2=ipfs, 3=blockchain, 4=done
    const [result, setResult] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (f) => {
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, []);

    const handleRegister = async () => {

        if (!signer) { connect(); return; }
        if (!file || !title.trim()) { toast.error("Please add a file and title"); return; }

        try {
            // Step 1: Hash
            setStep(1);
            const hexHash = await hashFile(file);
            const contentHash = ethers.utils.arrayify(hexHash);

            const contract = getContract(signer);

            // --- THE PRE-FLIGHT CHECK ---
            try {
                const existingRecord = await contract.getArtworkDetails(contentHash);
                // If owner is not the zero address, the artwork is already registered
                if (existingRecord.owner !== ethers.constants.AddressZero) {
                    toast.error("Registration Failed: This exact artwork is already protected on PRISM.", {
                        icon: '🛑',
                        duration: 5000,
                    });
                    setStep(0);
                    return; // Halt execution before IPFS upload or Wallet prompt
                }
            } catch (readError) {
                // If the contract throws on an empty mapping, we catch it here and proceed safely
                console.log("Hash not found on-chain, safe to proceed.");
            }
            // ----------------------------

            // Step 2: IPFS
            setStep(2);
            const ipfsHash = await uploadToIPFS(file, { title, description, artist: artistName });

            // Step 3: Blockchain
            setStep(3);
            const tx = await contract.registerArtwork(ipfsHash, contentHash, title, description, artistName);
            const receipt = await tx.wait();

            // Parse event
            const event = receipt.events.find(e => e.event === "ArtworkRegistered");
            const certId = event?.args?.certificateId;

            setResult({ txHash: receipt.transactionHash, ipfsHash, certId, contentHash: hexHash });
            setStep(4);
            toast.success("Artwork registered on-chain!");

        } catch (err) {
            console.error(err);

            // Improved error handling
            if (err.code === 4001) {
                toast.error("Transaction rejected in wallet.");
            } else if (err.reason === "Artwork already registered" || (err.message && err.message.includes("already registered"))) {
                toast.error("This artwork is already registered");
            } else {
                toast.error("Transaction failed");
            }

            setStep(0);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div 
                className="fixed inset-0 w-full h-full bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none -z-10"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-display text-5xl font-bold text-ink mb-2">Register Artwork</h1>
                    <p className="text-ink-muted text-sm mb-8">Protect your creative work with an immutable blockchain timestamp.</p>
                </motion.div>

                {/* Progress */}
                <div className="flex items-center gap-0 mb-10">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`flex justify-center items-center gap-2 text-lg font-body transition-colors ${step > i ? "text-verified" : step === i ? "text-accent" : "text-ink-faint"}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step > i ? "bg-verified/10 border-verified/30 text-verified" : step === i ? "bg-accent/10 border-accent/30 text-accent" : "border-border"}`}>
                                    {step > i ? "✓" : i + 1}
                                </span>
                                <span className="hidden md:block">{s}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${step > i ? "bg-verified/30" : "bg-border"}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step < 4 ? (
                        <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="grid gap-5">
                            {/* Drop zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => document.getElementById("file-input").click()}
                                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${dragging ? "border-accent bg-accent/5" : preview ? "border-verified/30 bg-surface-1" : "border-border hover:border-accent/30 bg-surface-1"
                                    }`}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*,video/*,audio/*,.gif,.webp"
                                    className="hidden"
                                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                                />
                                {preview ? (
                                    <div className="text-center">
                                        <img src={preview} alt="preview" className="max-h-48 rounded-xl mx-auto mb-3 object-contain" />
                                        <p className="text-sm text-verified flex items-center justify-center gap-1.5">
                                            <CheckCircle size={14} /> {file.name}
                                        </p>
                                        <p className="text-xs text-ink-faint mt-1">Click to replace</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-surface-2 border border-border rounded-xl flex items-center justify-center">
                                            <FileImage size={20} className="text-ink-muted" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-ink font-body">Drop your artwork here</p>
                                            <p className="text-xs text-ink-faint mt-1">JPG, PNG, GIF, WebP, MP4 — max 50MB</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Fields */}
                            <div>
                                <label className="block text-xs font-body mb-1.5">Creator Name *</label>
                                <input
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    placeholder="e.g., Abhay Singh or Studio Flux"
                                    className="w-full bg-surface-1 border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-accent/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-body mb-1.5">Title *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter artwork title"
                                    className="w-full bg-surface-1 border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-accent/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-body mb-1.5">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Describe your artwork (optional)"
                                    className="w-full bg-surface-1 border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-accent/40 transition-colors resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleRegister}
                                size="lg"
                                loading={step > 0 && step < 4}
                                className="w-full"
                            >
                                {!account ? "Connect Wallet to Register" :
                                    step === 1 ? "Generating hash…" :
                                        step === 2 ? "Uploading to IPFS…" :
                                            step === 3 ? "Waiting for confirmation…" :
                                                <>Register on Blockchain <ArrowRight size={16} /></>}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface-1 border border-verified/20 rounded-2xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-verified/10 border border-verified/30 rounded-xl flex items-center justify-center">
                                    <CheckCircle size={22} className="text-verified" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-ink text-xl">Registered Successfully</h2>
                                    <p className="text-sm text-ink-muted">Your artwork is now permanently on-chain</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { label: "Certificate ID", value: result?.certId },
                                    { label: "TX Hash", value: result?.txHash },
                                    { label: "IPFS Hash", value: `ipfs://${result?.ipfsHash}` },
                                    { label: "Content Hash", value: result?.contentHash },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                                        <span className="text-xs text-ink-faint font-body">{label}</span>
                                        <span className="font-mono text-xs text-ink-muted text-right break-all max-w-xs">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to={`/certificate?hash=${result?.contentHash}`}>
                                <Button asChild size="lg" className="w-full">
                                    View & Download Certificate
                                    <ArrowRight size={16}/>
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}