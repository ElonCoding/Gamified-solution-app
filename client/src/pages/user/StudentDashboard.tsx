import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogIn,
    LogOut,
    BookOpen,
    Trophy,
    TrendingUp,
    Zap,
    Play,
    User,
    Lock,
    ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const tests = [
        { id: 1, title: "Quantum Physics Basics", duration: "30 mins", reward: "Crystal Shard", status: "Available" },
        { id: 2, title: "Advanced Calculus", duration: "45 mins", reward: "Golden Compass", status: "Locked", level: 5 },
        { id: 3, title: "Bio-Genetics 101", duration: "25 mins", reward: "Helix DNA", status: "Completed" },
    ];

    const studentStats = {
        name: "Alex Johnson",
        level: 4,
        xp: 2450,
        nextLevelXp: 3000,
        rewards: 12
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoading(false);
        }, 1500);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setStudentId("");
        setPassword("");
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-edu-dark flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-edu-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-edu-secondary/10 blur-[120px] rounded-full pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-edu-surface backdrop-blur-2xl border border-white/10 rounded-3xl p-10 relative z-10 shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-edu-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-edu-primary/30">
                            <BookOpen className="text-edu-primary w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">EduNexus</h1>
                        <p className="text-gray-400 text-sm mt-2 font-mono tracking-widest uppercase">Student Portal v2.0</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-1">Student ID</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input 
                                    type="text" 
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="STU-00123"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-edu-primary outline-none transition-all placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-edu-primary outline-none transition-all placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-edu-primary hover:bg-edu-primary/80 text-white font-bold rounded-xl transition-all shadow-lg shadow-edu-primary/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Authenticating..." : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                        Connect with your educator if you've lost your access key.
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-edu-dark text-white p-6 md:p-12 font-sans relative">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-edu-primary/10 flex items-center justify-center border border-edu-primary/20">
                            <User className="text-edu-primary" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{studentStats.name}</h2>
                            <p className="text-edu-secondary text-sm font-mono uppercase tracking-widest">ID: {studentId || "STU-8829"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-edu-surface px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-8 backdrop-blur-xl">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-mono">Level</div>
                                <div className="text-xl font-bold text-edu-accent">{studentStats.level}</div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 uppercase font-mono">Trophies</div>
                                <div className="text-xl font-bold text-edu-secondary">{studentStats.rewards}</div>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/20 transition-all"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Progress */}
                    <div className="space-y-8">
                        {/* XP Progress Card */}
                        <div className="bg-edu-surface rounded-3xl p-8 border border-white/5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <TrendingUp className="text-edu-secondary" size={20} />
                                    Exp Progress
                                </h3>
                                <div className="text-xs text-gray-400 font-mono italic">550 XP to Level {studentStats.level + 1}</div>
                            </div>
                            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(studentStats.xp / studentStats.nextLevelXp) * 100}%` }}
                                    className="bg-edu-secondary h-full rounded-full"
                                />
                            </div>
                            <div className="flex justify-between text-xs font-mono text-gray-500">
                                <span>{studentStats.xp} XP</span>
                                <span>{studentStats.nextLevelXp} XP</span>
                            </div>
                        </div>

                        {/* Inventory Preview */}
                        <div className="bg-edu-surface rounded-3xl p-8 border border-white/5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Trophy className="text-edu-accent" size={20} />
                                    Trophy Room
                                </h3>
                                <button 
                                    onClick={() => navigate("/submissions")} 
                                    className="text-xs text-edu-accent hover:underline font-mono"
                                >
                                    VIEW ALL
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-square bg-black/20 rounded-xl border border-white/5 flex items-center justify-center group hover:border-edu-accent/30 transition-all cursor-pointer">
                                        <Zap className="text-gray-700 group-hover:text-edu-accent transition-colors" size={16} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle/Right Column: Test Series */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <ClipboardList className="text-edu-primary" size={24} />
                                Available Test Series
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-edu-primary/10 text-edu-primary rounded-full text-[10px] font-mono border border-edu-primary/20">ALL SUBJECTS</span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {tests.map(test => (
                                <motion.div 
                                    key={test.id}
                                    whileHover={{ x: 10 }}
                                    className={`bg-edu-surface rounded-2xl p-6 border border-white/5 backdrop-blur-xl flex items-center justify-between group cursor-pointer transition-all hover:bg-white/5
                                        ${test.status === 'Locked' ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
                                    onClick={() => test.status === 'Available' && navigate("/scanner")}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                            ${test.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
                                              test.status === 'Locked' ? 'bg-gray-500/10 text-gray-500' : 'bg-edu-primary/10 text-edu-primary'}`}>
                                            {test.status === 'Completed' ? <Zap size={24} /> : 
                                             test.status === 'Locked' ? <Lock size={24} /> : <BookOpen size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg group-hover:text-edu-primary transition-colors">{test.title}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-xs text-gray-500 flex items-center gap-1 font-mono uppercase"><Play size={10} /> {test.duration}</span>
                                                <span className="text-xs text-edu-accent flex items-center gap-1 font-mono uppercase"><Trophy size={10} /> {test.reward}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {test.status === 'Available' ? (
                                            <button className="px-6 py-2 bg-edu-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-edu-primary/20">
                                                START
                                            </button>
                                        ) : test.status === 'Locked' ? (
                                            <div className="text-xs text-gray-500 font-mono">UNLOCKS AT LVL {test.level}</div>
                                        ) : (
                                            <div className="px-6 py-2 border border-green-500/20 text-green-500 text-xs font-bold rounded-lg bg-green-500/5">
                                                COMPLETED
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
