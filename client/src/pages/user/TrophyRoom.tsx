import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getStudentSubmissions } from "../../services/scanService";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Box, Sparkles, LayoutGrid, List, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Submission {
    _id: string;
    username: string;
    wish: string; // Internal key for backend compatibility (represents Reward Name)
    sentiment: string;
    status: string;
    imageUrl: string;
    modelUrl?: string;
    createdAt: string;
}

const TrophyRoom = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await getStudentSubmissions(token);
                    if (response.success) {
                        setSubmissions(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching submissions:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSubmissions();
    }, [currentUser]);

    const filteredSubmissions = submissions.filter(r => 
        r.wish.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-edu-dark text-white relative overflow-hidden font-sans p-6 md:p-12">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-edu-secondary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pt-12">
                <div className="space-y-2">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-edu-primary/70 hover:text-edu-primary transition-colors font-mono text-xs tracking-widest uppercase mb-4"
                    >
                        <ArrowLeft size={16} /> Return to Console
                    </motion.button>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Digital <span className="text-edu-accent">Trophy Room</span></h1>
                    <p className="text-gray-400 max-w-lg">A permanent registry of your academic achievements and material rewards.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input 
                            type="text"
                            placeholder="Search keywords..."
                            className="bg-edu-surface border border-white/10 rounded-xl py-3 pl-12 pr-6 outline-none focus:border-edu-primary transition-all w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-edu-primary border-t-transparent rounded-full animate-spin" />
                        <div className="text-edu-primary font-mono text-xs tracking-widest uppercase animate-pulse">Syncing Inventory...</div>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
                        <Box className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">Inventory Empty</h3>
                        <p className="text-gray-600 mt-2">Complete test series to earn exclusive 3D rewards.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="mt-8 px-8 py-3 bg-edu-primary/10 text-edu-primary border border-edu-primary/20 rounded-xl hover:bg-edu-primary hover:text-white transition-all font-bold"
                        >
                            GO TO TESTS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredSubmissions.map((submission, i) => (
                                <motion.div
                                    key={submission._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(`/submissions/${submission._id}`)}
                                    className="group bg-edu-surface rounded-3xl p-2 border border-white/5 hover:border-edu-primary/30 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="aspect-square bg-black/40 rounded-2xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <img 
                                            src={submission.imageUrl || '/images/placeholder-reward.jpg'} 
                                            alt={submission.wish}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        <div className="absolute top-3 right-3 z-20">
                                            <div className="bg-edu-dark/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-edu-accent font-bold uppercase tracking-widest">
                                                ID: {submission._id.slice(-4)}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-edu-primary text-white p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Eye size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2 text-edu-secondary">
                                            <Sparkles size={14} />
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Academic Grade A+</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-none mb-2">{submission.wish}</h3>
                                        <div className="text-gray-500 text-xs font-mono">EARNED: {new Date(submission.createdAt).toLocaleDateString()}</div>
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute -inset-1 bg-linear-to-r from-edu-primary/0 via-edu-primary/10 to-edu-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrophyRoom;
