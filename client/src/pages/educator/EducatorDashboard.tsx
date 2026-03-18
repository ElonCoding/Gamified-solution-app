import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    Plus,
    Users,
    MessageCircle,
    BarChart3,
    Settings,
    ShieldCheck,
    AlertCircle,
    Trash2,
    Save,
    ChevronRight,
    Trophy
} from "lucide-react";

interface Question {
    id: string;
    text: string;
    type: 'mcq' | 'text';
    options?: string[];
    correctAnswer?: string;
}

const EducatorDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 156,
        pendingDoubts: 8,
        avgScore: 78,
        activeTests: 4,
    });
    const [showBuilder, setShowBuilder] = useState(false);
    const [newTest, setNewTest] = useState({
        title: "",
        questions: [] as Question[],
        rewards: {
            full: "Premium 3D Dragon",
            pass: "Standard 3D Shield"
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("educator_token");
        navigate("/educator/login");
    };

    const addQuestion = () => {
        const q: Question = {
            id: Math.random().toString(36).substr(2, 9),
            text: "",
            type: 'mcq',
            options: ["", "", "", ""],
            correctAnswer: ""
        };
        setNewTest(prev => ({ ...prev, questions: [...prev.questions, q] }));
    };

    const removeQuestion = (id: string) => {
        setNewTest(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== id)
        }));
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setNewTest(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
        }));
    };

    return (
        <div className="min-h-screen bg-edu-dark text-white font-sans">
            {/* Sidebar / Top Nav */}
            <div className="flex flex-col lg:flex-row min-h-screen">
                <aside className="w-full lg:w-64 bg-edu-surface border-r border-white/5 p-6 space-y-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-edu-primary rounded-xl flex items-center justify-center">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">EduConsole</span>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-edu-primary/10 text-edu-primary border border-edu-primary/20 rounded-xl font-medium">
                            <BarChart3 size={18} /> Overview
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
                            <Users size={18} /> Students
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
                            <MessageCircle size={18} /> Doubts 
                            <span className="ml-auto bg-edu-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md">8</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
                            <Settings size={18} /> Settings
                        </button>
                    </nav>

                    <div className="pt-20">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 overflow-y-auto max-h-screen">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold">Educator Control Center</h1>
                            <p className="text-gray-400 mt-1">Manage tests, monitor performance, and assign 3D rewards.</p>
                        </div>
                        <button 
                            onClick={() => setShowBuilder(true)}
                            className="px-6 py-3 bg-edu-primary hover:bg-edu-primary/80 text-white font-bold rounded-xl shadow-lg shadow-edu-primary/20 flex items-center gap-2 transition-all"
                        >
                            <Plus size={20} /> CREATE NEW TEST
                        </button>
                    </header>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-400" },
                            { label: "Pending Doubts", value: stats.pendingDoubts, icon: MessageCircle, color: "text-edu-accent" },
                            { label: "Avg Class Score", value: `${stats.avgScore}%`, icon: BarChart3, color: "text-green-400" },
                            { label: "Active Test Series", value: stats.activeTests, icon: ShieldCheck, color: "text-edu-primary" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-edu-surface border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
                                <stat.icon className={`${stat.color} mb-4`} size={24} />
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Student Activity Feed */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-edu-surface border border-white/5 rounded-3xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <ActivityIcon className="text-edu-secondary" size={20} />
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-edu-primary/10 flex items-center justify-center font-bold text-edu-primary">JD</div>
                                                <div>
                                                    <div className="font-bold">John Doe</div>
                                                    <div className="text-xs text-gray-500">Completed: Quantum Physics Basics</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">92%</div>
                                                <div className="text-[10px] text-gray-600 font-mono">REWARD: CRYSTAL SHARD</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    VIEW FULL AUDIT LOG
                                </button>
                            </div>
                        </div>

                        {/* Low Performance Alerts */}
                        <div className="space-y-6">
                            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
                                <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                                    <AlertCircle size={18} /> High Priority Alerts
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-black/20 rounded-xl border-l-4 border-red-500">
                                        <div className="text-sm font-bold">Security Violation</div>
                                        <p className="text-xs text-gray-500 mt-1">Student #8829 (Sarah L.) switched tabs 4 times during Exam #12.</p>
                                    </div>
                                    <div className="p-4 bg-black/20 rounded-xl border-l-4 border-yellow-500">
                                        <div className="text-sm font-bold">Low Score Alert</div>
                                        <p className="text-xs text-gray-500 mt-1">Class average for 'Calculus II' dropped by 15% this week.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Test Builder Modal */}
            <AnimatePresence>
                {showBuilder && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-edu-dark border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-edu-surface">
                                <h2 className="text-2xl font-bold">Test & Reward Builder</h2>
                                <button onClick={() => setShowBuilder(false)} className="p-2 hover:bg-white/10 rounded-full"><Plus className="rotate-45" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Test Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl font-bold focus:border-edu-primary outline-none"
                                        placeholder="Enter test title (e.g. Advanced AI Safety)"
                                        value={newTest.title}
                                        onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                                    />
                                </div>

                                {/* Questions */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg">Questions Architecture</h3>
                                        <button onClick={addQuestion} className="px-4 py-2 bg-edu-primary/10 text-edu-primary border border-edu-primary/20 rounded-lg text-sm flex items-center gap-2 hover:bg-edu-primary/20">
                                            <Plus size={16} /> ADD QUESTION
                                        </button>
                                    </div>

                                    {newTest.questions.length === 0 && (
                                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                            <p className="text-gray-500">No questions added yet. Define your testing parameters.</p>
                                        </div>
                                    )}

                                    {newTest.questions.map((q, idx) => (
                                        <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group">
                                            <button 
                                                onClick={() => removeQuestion(q.id)}
                                                className="absolute top-6 right-6 text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            
                                            <div className="text-edu-primary font-mono text-xs mb-4">QUESTION_STUB_{idx + 1}</div>
                                            <textarea 
                                                className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white focus:border-edu-primary outline-none resize-none mb-4"
                                                placeholder="Enter question text..."
                                                value={q.text}
                                                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                            />

                                            <div className="flex gap-4">
                                                <select 
                                                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none"
                                                    value={q.type}
                                                    onChange={(e) => updateQuestion(q.id, { type: e.target.value as any })}
                                                >
                                                    <option value="mcq">Multiple Choice</option>
                                                    <option value="text">Long Form Essay</option>
                                                </select>
                                                <input 
                                                    type="text"
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none"
                                                    placeholder="Correct Answer (for auto-grading)"
                                                    value={q.correctAnswer}
                                                    onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reward Tiers */}
                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Trophy className="text-edu-accent" size={20} />
                                        Automated Reward Tiers
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-edu-accent/5 border border-edu-accent/20 p-6 rounded-2xl">
                                            <div className="text-xs font-mono text-edu-accent uppercase mb-4">Tier 1: Master (100%)</div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-edu-accent/10 rounded-xl text-edu-accent"><Trophy size={20} /></div>
                                                <input 
                                                    className="bg-transparent border-b border-edu-accent/30 outline-none w-full py-1 font-bold"
                                                    value={newTest.rewards.full}
                                                    onChange={(e) => setNewTest({...newTest, rewards: {...newTest.rewards, full: e.target.value}})}
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-edu-secondary/5 border border-edu-secondary/20 p-6 rounded-2xl">
                                            <div className="text-xs font-mono text-edu-secondary uppercase mb-4">Tier 2: Pass (&gt;50%)</div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-edu-secondary/10 rounded-xl text-edu-secondary"><ShieldCheck size={20} /></div>
                                                <input 
                                                    className="bg-transparent border-b border-edu-secondary/30 outline-none w-full py-1 font-bold"
                                                    value={newTest.rewards.pass}
                                                    onChange={(e) => setNewTest({...newTest, rewards: {...newTest.rewards, pass: e.target.value}})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-edu-surface flex justify-end gap-4">
                                <button 
                                    onClick={() => setShowBuilder(false)}
                                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-8 py-3 bg-edu-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-edu-primary/20">
                                    <Save size={18} /> PUBLISH TEST SERIES
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActivityIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default EducatorDashboard;
