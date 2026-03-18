import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getRewardById } from "../../services/scanService";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Trophy,
    Calendar,
    Clock,
    Zap,
    ShieldCheck,
    Box,
    Maximize2
} from "lucide-react";
import "@google/model-viewer";

interface Reward {
    _id: string;
    username: string;
    wish: string; // Internal key for backend compatibility (represents Reward Name)
    sentiment: string;
    status: string;
    imageUrl: string;
    modelUrl?: string;
    createdAt: string;
}

const ARPlayground = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [reward, setReward] = useState<Reward | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReward = async () => {
            if (currentUser && id) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await getRewardById(id, token);
                    if (response.success) {
                        setReward(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch reward", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReward();
    }, [currentUser, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-edu-dark text-white flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-edu-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-edu-primary tracking-widest uppercase animate-pulse">Establishing Neural Link...</div>
                </div>
            </div>
        );
    }

    if (!reward) {
        return (
            <div className="min-h-screen bg-edu-dark text-white flex flex-col items-center justify-center font-mono p-4">
                <div className="text-red-500 mb-4 text-xl font-bold">REWARD DATA CORRUPTED</div>
                <button
                    onClick={() => navigate("/submissions")}
                    className="flex items-center gap-2 text-edu-secondary hover:underline transition-all uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Return to Inventory
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-edu-dark text-white relative overflow-hidden font-sans p-6 md:p-12">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-edu-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/submissions")}
                    className="mb-12 flex items-center gap-2 text-edu-secondary/70 hover:text-edu-secondary transition-colors font-mono text-xs tracking-widest uppercase"
                >
                    <ArrowLeft size={16} /> Back to Inventory
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left: 3D/AR Viewer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-7"
                    >
                        <div className="aspect-square bg-edu-surface rounded-[40px] overflow-hidden border border-white/10 relative shadow-2xl backdrop-blur-3xl group">
                            {reward.modelUrl ? (
                                // @ts-ignore
                                <model-viewer
                                    src={`${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/scan/model-proxy/${reward._id}`}
                                    ios-src=""
                                    poster={reward.imageUrl}
                                    alt={reward.wish}
                                    shadow-intensity="1"
                                    camera-controls
                                    auto-rotate
                                    ar
                                    ar-modes="webxr scene-viewer quick-look"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                                        <div className="bg-edu-dark/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-mono tracking-widest uppercase">AR Ready</span>
                                        </div>
                                    </div>

                                    <button
                                        slot="ar-button"
                                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-edu-primary hover:bg-edu-primary/90 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-edu-primary/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Maximize2 size={20} /> PROJECT INTO STUDY SPACE
                                    </button>
                                    {/* @ts-ignore */}
                                </model-viewer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-gray-500">
                                    <Box size={80} className="mb-6 opacity-20" />
                                    <h3 className="text-xl font-bold mb-2">3D Asset Materializing</h3>
                                    <p className="text-sm max-w-xs">The high-fidelity model is being synced from the educator's repository. Please stand by.</p>
                                </div>
                            )}

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-edu-primary/5 rounded-full blur-3xl -z-10" />
                        </div>
                    </motion.div>

                    {/* Right: Reward Metadata */}
                    <div className="lg:col-span-5 space-y-10">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="text-edu-secondary font-mono text-[10px] tracking-[0.4em] uppercase mb-4 font-black flex items-center gap-3">
                                <Trophy size={14} className="animate-pulse-glow" /> 
                                <span className="text-glow">Level 5 Achievement Unlocked</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-white text-glow">
                                {reward.wish}
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <div className="glass-card px-5 py-2.5 flex items-center gap-3 text-xs font-mono border-white/5 hover:border-edu-primary/30 transition-colors group/meta">
                                    <Calendar size={14} className="text-edu-secondary group-hover:scale-110 transition-transform" />
                                    <span className="text-gray-400">SYNCED:</span>
                                    <span className="text-white font-bold">{new Date(reward.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="glass-card px-5 py-2.5 flex items-center gap-3 text-xs font-mono border-white/5 hover:border-edu-accent/30 transition-colors group/meta">
                                    <ShieldCheck size={14} className="text-edu-accent group-hover:scale-110 transition-transform" />
                                    <span className="text-gray-400">HASH:</span>
                                    <span className="text-white font-bold">{reward._id.slice(0, 8).toUpperCase()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                        <div className="space-y-6">
                            <div className="bg-edu-surface p-8 rounded-3xl border border-white/5 backdrop-blur-xl relative">
                                <div className="absolute top-0 right-0 p-6">
                                    <ShieldCheck className="text-edu-primary opacity-20" size={40} />
                                </div>
                                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Subject Performance Analysis</h3>
                                <p className="text-lg italic text-gray-300 leading-relaxed font-serif">
                                    "Verified grade A+ performance across all testing modules. This reward represents the student's mastery of core concepts and commitment to excellence."
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-edu-primary/5 border border-edu-primary/20 p-6 rounded-3xl">
                                    <div className="text-[10px] text-edu-primary font-mono uppercase mb-2">Rarity</div>
                                    <div className="text-lg font-bold">LEGENDARY</div>
                                </div>
                                <div className="bg-edu-secondary/5 border border-edu-secondary/20 p-6 rounded-3xl">
                                    <div className="text-[10px] text-edu-secondary font-mono uppercase mb-2">Power Level</div>
                                    <div className="text-lg font-bold">LVL 4</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button className="w-full flex items-center justify-center gap-3 px-8 py-5 border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold tracking-widest group">
                                <Box className="group-hover:rotate-12 transition-transform" /> SHARE ACHIEVEMENT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ARPlayground;
