import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Trophy,
    ShieldCheck,
    BarChart3,
    Box,
    CheckCircle2,
    Sparkles,
    Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import HologramViewer from "../../components/HologramViewer";

const RewardGenerationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const testData = location.state || { score: 92, keystrokes: 450, warnings: 0 };
    
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Mock reward data based on score
    const reward = {
        name: testData.score === 100 ? "Grandmaster's Relic" : "Scholar's Sigil",
        tier: testData.score === 100 ? "Premium" : "Standard",
        description: "A mark of excellence in academic pursuit.",
        modelUrl: "/models/trophy.glb" // Placeholder
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCollect = () => {
        navigate("/submissions");
    };

    return (
        <div className="min-h-screen bg-edu-dark text-white relative overflow-hidden font-sans p-6 md:p-12">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-edu-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-edu-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 z-20 flex items-center gap-2 text-edu-secondary/70 hover:text-edu-secondary transition-colors font-mono text-xs tracking-widest uppercase"
            >
                <ArrowLeft size={16} /> Return to Dashboard
            </motion.button>

            <div className="max-w-6xl mx-auto pt-16 relative z-10">
                <AnimatePresence>
                    {showContent && (
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Achievement Details */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-edu-accent/10 border border-edu-accent/30 text-edu-accent text-xs font-bold tracking-widest uppercase"
                                    >
                                        <Sparkles size={14} /> Level Complete
                                    </motion.div>
                                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-none">
                                        EXCELLENT <br />
                                        <span className="text-edu-secondary">PERFORMANCE</span>
                                    </h1>
                                    <p className="text-gray-400 text-lg max-w-md bg-white/5 p-4 rounded-2xl border border-white/5">
                                        Your academic integrity and subject mastery have been verified. A new 3D reward has been unlocked.
                                    </p>
                                </div>

                                {/* Performance Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-edu-surface p-4 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Score</div>
                                        <div className="text-2xl font-bold text-edu-primary">{testData.score}%</div>
                                    </div>
                                    <div className="bg-edu-surface p-4 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Keystrokes</div>
                                        <div className="text-2xl font-bold text-edu-secondary">{testData.keystrokes}</div>
                                    </div>
                                    <div className="bg-edu-surface p-4 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Warnings</div>
                                        <div className={`text-2xl font-bold ${testData.warnings > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {testData.warnings}
                                        </div>
                                    </div>
                                </div>

                                {/* Reward Card */}
                                <div className="bg-edu-surface/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                                        <Trophy size={140} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-edu-accent/20 rounded-xl flex items-center justify-center border border-edu-accent/30">
                                                <Zap className="text-edu-accent" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-edu-accent font-mono uppercase tracking-widest font-bold">{reward.tier} Reward Unlocked</div>
                                                <h3 className="text-2xl font-bold">{reward.name}</h3>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm">
                                            {reward.description} This item has been added to your digital trophy room and is ready for AR projection.
                                        </p>
                                        <button 
                                            onClick={handleCollect}
                                            className="w-full py-4 bg-edu-primary hover:bg-edu-primary/80 text-white font-bold rounded-2xl transition-all shadow-lg shadow-edu-primary/20 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={20} /> COLLECT & VIEW INVENTORY
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: 3D Preview */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="relative aspect-square flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-edu-primary/5 rounded-full blur-[100px] animate-pulse" />
                                <div className="w-full h-full relative z-10">
                                    <HologramViewer 
                                        modelUrl={null} // Using default placeholder for now
                                        onLoaded={() => setIsModelLoaded(true)}
                                    />
                                    {!isModelLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-edu-primary border-t-transparent rounded-full animate-spin" />
                                                <div className="font-mono text-xs text-edu-primary tracking-widest uppercase animate-pulse">
                                                    Materializing 3D Assets...
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Decoration */}
                                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-edu-primary/30 rounded-tl-3xl" />
                                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-edu-accent/30 rounded-br-3xl" />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RewardGenerationPage;
