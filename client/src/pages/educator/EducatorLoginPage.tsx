import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, GraduationCap, KeyRound, AlertCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EducatorLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("educator_token");
        if (token) {
            navigate("/educator/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simple auth simulation (using original env vars for continuity)
        setTimeout(() => {
            if (email === (import.meta.env.VITE_EDUCATOR_USERNAME || "professor@institution.edu") && 
                password === (import.meta.env.VITE_EDUCATOR_PASSWORD || "admin_secure_2026")) {
                localStorage.setItem("educator_token", "valid_session");
                navigate("/educator/dashboard", { replace: true });
            } else {
                setError("AUTHENTICATION FAILED: Invalid Educator Credentials");
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-edu-dark text-white relative overflow-hidden font-sans flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-edu-primary/10 via-black to-black opacity-80 pointer-events-none" />
            
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-edu-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-edu-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />

            <div className="w-full max-w-lg relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-edu-surface/40 border border-white/5 backdrop-blur-3xl rounded-[40px] p-10 md:p-14 shadow-2xl relative overflow-hidden"
                >
                    {/* Glassmorphic Accent */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />

                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-edu-primary/20 border border-edu-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <ShieldCheck className="text-edu-primary w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-3">INSTITUTIONAL LOGIN</h1>
                        <p className="text-gray-500 text-[10px] font-mono tracking-[0.4em] uppercase">
                            Educator Command Interface v4.0.2
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-gray-400 tracking-widest ml-1 uppercase font-bold">Educator ID / Email</label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-edu-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-edu-primary focus:bg-edu-primary/5 transition-all font-sans text-sm placeholder-gray-700"
                                    placeholder="professor@institution.edu"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase font-bold">Secure Passcode</label>
                                <a href="#" className="text-[10px] font-mono text-edu-secondary hover:underline uppercase tracking-tight">Forgot Key?</a>
                            </div>
                            <div className="relative group">
                                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-edu-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-edu-primary focus:bg-edu-primary/5 transition-all font-sans text-sm placeholder-gray-700"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 text-red-400 text-xs bg-red-500/10 p-4 rounded-2xl border border-red-500/20"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-edu-primary hover:bg-edu-primary/90 text-white font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-edu-primary/20 hover:shadow-edu-primary/40 disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3 overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock size={18} className="group-hover:scale-110 transition-transform" />
                                    <span>AUTHORIZE ENTRY</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-white/5 pt-8">
                        <p className="text-[9px] text-gray-600 font-mono leading-relaxed px-4">
                            THIS SYSTEM IS MONITORED. UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED AND REPORTED TO ACADEMIC INTEGRITY OFFICE.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EducatorLoginPage;
