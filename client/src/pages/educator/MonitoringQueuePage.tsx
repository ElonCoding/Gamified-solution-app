import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Check,
    X,
    ArrowLeft,
    Clock,
    ShieldCheck,
    AlertCircle,
    User,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";
import { getEducatorQueue, updateSubmissionStatus } from "../../services/scanService";

interface Submission {
    _id: string;
    username: string;
    wish: string; // Keeping 'wish' in interface to match backend model for now, but UI will show 'Response'
    sentiment: string;
    status: 'pending' | 'approved' | 'denied';
    imageUrl?: string;
    createdAt: string;
}

const MonitoringQueuePage = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await getEducatorQueue();
            if (response.success) {
                setSubmissions(response.data.filter((w: Submission) => w.status === 'pending'));
            }
        } catch (error) {
            console.error("Failed to fetch queue", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, newStatus: 'approved' | 'denied') => {
        setProcessingId(id);
        try {
            const response = await updateSubmissionStatus(id, newStatus);
            if (response.success) {
                setSubmissions(prev => prev.filter(w => w._id !== id));
            }
        } catch (error) {
            console.error("Failed to process submission", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-edu-dark text-white font-sans relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-edu-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <header className="relative z-20 border-b border-white/5 bg-edu-surface/50 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/educator/dashboard')}
                            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/5 transition-all group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Clock className="text-edu-accent" size={24} />
                                VERIFICATION QUEUE
                            </h1>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">Real-time Submission Monitoring</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                className="bg-edu-dark/50 border border-white/10 rounded-xl py-2 pl-12 pr-6 text-sm outline-none focus:border-edu-primary transition-all"
                                placeholder="Filter students..."
                            />
                        </div>
                        <div className="px-5 py-2 bg-edu-accent/10 border border-edu-accent/20 rounded-xl text-edu-accent text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-edu-accent rounded-full animate-pulse" />
                            {submissions.length} PENDING VERIFICATION
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-10 flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-edu-primary border-t-transparent rounded-full animate-spin" />
                        <div className="text-edu-primary font-mono text-xs tracking-widest uppercase animate-pulse">Syncing Submission Database...</div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {submissions.map((sub) => (
                                <motion.div
                                    key={sub._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                                    className="group bg-edu-surface border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all shadow-xl hover:shadow-2xl"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Visual Proof Section */}
                                        <div className="md:w-64 h-64 md:h-auto bg-edu-dark relative overflow-hidden">
                                            {sub.imageUrl ? (
                                                <img
                                                    src={sub.imageUrl}
                                                    alt="Submission Proof"
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                    <AlertCircle size={48} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-edu-dark/80 via-transparent to-transparent pointer-events-none" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-edu-primary/20 backdrop-blur-md px-3 py-1 rounded-lg border border-edu-primary/30 text-[10px] font-mono text-edu-primary font-bold uppercase tracking-widest">
                                                    ID: {sub._id.slice(-8)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assessment Section */}
                                        <div className="flex-1 p-8 flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                        <User className="text-edu-secondary" size={20} />
                                                        {sub.username}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-tight">
                                                        SUBMITTED: {new Date(sub.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-gray-400">
                                                    V.2.0-SECURE
                                                </div>
                                            </div>

                                            <div className="bg-edu-dark border border-white/5 p-6 rounded-2xl mb-8 relative">
                                                <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-3">Response Snippet</div>
                                                <p className="text-gray-300 italic leading-relaxed text-lg">"{sub.wish}"</p>
                                                <div className="absolute top-0 right-0 p-4">
                                                    <ChevronRight className="text-gray-800" size={32} />
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Integrity Rank:</div>
                                                    <div className={`px-4 py-1.5 rounded-xl border font-bold text-xs tracking-widest uppercase ${
                                                        sub.sentiment.toLowerCase().includes('positive') 
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                                                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                    }`}>
                                                        {sub.sentiment.toLowerCase().includes('positive') ? 'EXCELLENT' : 'FLAGGED'}
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAction(sub._id, 'denied')}
                                                        disabled={processingId === sub._id}
                                                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold text-xs tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        <X size={16} className="inline mr-2" /> REJECT
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(sub._id, 'approved')}
                                                        disabled={processingId === sub._id}
                                                        className="px-8 py-3 bg-edu-primary text-white rounded-xl font-bold text-xs tracking-widest transition-all shadow-lg shadow-edu-primary/20 hover:shadow-edu-primary/40 disabled:opacity-50"
                                                    >
                                                        {processingId === sub._id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                                        ) : (
                                                            <>
                                                                <Check size={16} className="inline mr-2" /> VERIFY & REWARD
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {submissions.length === 0 && !loading && (
                            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-edu-surface/20">
                                <ShieldCheck size={64} className="mx-auto mb-6 text-gray-800" />
                                <h3 className="text-2xl font-bold text-gray-400">QUEUE CLEAR</h3>
                                <p className="text-gray-600 mt-2 max-w-xs mx-auto">All test submissions have been verified and processed for the current block.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MonitoringQueuePage;
