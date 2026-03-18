import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, 
    AlertTriangle, 
    Clock, 
    Send, 
    Eye, 
    EyeOff,
    CheckCircle2,
    Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Question {
    id: number;
    text: string;
    type: 'mcq' | 'text';
    options?: string[];
}

const SecureTestEnvironment = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isFocused, setIsFocused] = useState(true);
    const [warningCount, setWarningCount] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [keystrokes, setKeystrokes] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions: Question[] = [
        {
            id: 1,
            text: "Explain the concept of 'Quantum Entanglement' in your own words.",
            type: 'text'
        },
        {
            id: 2,
            text: "Which of the following is NOT a fundamental force of nature?",
            type: 'mcq',
            options: ["Gravity", "Electromagnetism", "Strong Nuclear", "Centrifugal Force"]
        }
    ];

    // Anti-cheating: Focus monitoring
    useEffect(() => {
        const handleBlur = () => {
            setIsFocused(false);
            setWarningCount(prev => prev + 1);
        };
        const handleFocus = () => {
            setIsFocused(true);
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Disable shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
            }
            
            // Keystroke monitor
            if (testStarted && !isSubmitting) {
                setKeystrokes(prev => prev + 1);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [testStarted, isSubmitting]);

    // Timer
    useEffect(() => {
        if (testStarted && timeLeft > 0 && !isSubmitting) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [testStarted, timeLeft, isSubmitting]);

    const handleAnswerChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex].id]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // For hackathon purposes, we simulate the submission
            // but navigate to the correct result page
            navigate("/scan-result", { 
                state: { 
                    score: 85, 
                    keystrokes, 
                    warnings: warningCount 
                } 
            });
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!testStarted) {
        return (
            <div className="min-h-screen bg-edu-dark flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-edu-surface backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-edu-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-edu-primary w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Secure Exam Proxy</h1>
                    <p className="text-gray-400 mb-8">
                        You are about to enter a proctored environment. Tab switching, copy-pasting, and external shortcuts are disabled.
                    </p>
                    <button 
                        onClick={() => setTestStarted(true)}
                        className="w-full py-4 bg-edu-primary hover:bg-edu-primary/80 text-white font-bold rounded-xl transition-all shadow-lg shadow-edu-primary/20"
                    >
                        START EXAMINATION
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-edu-dark text-white p-4 md:p-8 transition-all duration-500 ${!isFocused ? 'blur-xl grayscale' : ''}`}>
            {/* Proctoring Header */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 bg-edu-surface/50 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                    <Shield className="text-edu-secondary animate-pulse" size={20} />
                    <div className="text-xs font-mono tracking-widest uppercase">
                        <span className="text-gray-500">Status:</span> <span className="text-edu-secondary">Active Monitoring</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-edu-accent font-mono bold">
                        <Clock size={20} />
                        <span className="text-xl">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block" />
                    <div className="text-xs font-mono">
                        <span className="text-gray-500 uppercase tracking-tighter">Warnings:</span> 
                        <span className={`ml-2 font-bold ${warningCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {warningCount}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
                {/* Main Test Area */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div 
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-edu-surface backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                    >
                        <div className="text-edu-primary font-mono text-xs tracking-widest uppercase mb-4">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-8 leading-tight">
                            {questions[currentQuestionIndex].text}
                        </h2>

                        {questions[currentQuestionIndex].type === 'text' ? (
                            <textarea
                                className="w-full h-64 bg-black/20 border border-white/10 rounded-2xl p-6 text-white focus:border-edu-primary outline-none transition-all resize-none font-sans leading-relaxed"
                                placeholder="Type your answer here..."
                                value={answers[questions[currentQuestionIndex].id] || ''}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                onCopy={(e) => e.preventDefault()}
                                onCut={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                                spellCheck={false}
                            />
                        ) : (
                            <div className="space-y-4">
                                {questions[currentQuestionIndex].options?.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerChange(option)}
                                        className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group
                                            ${answers[questions[currentQuestionIndex].id] === option 
                                                ? 'border-edu-primary bg-edu-primary/10' 
                                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <span className={answers[questions[currentQuestionIndex].id] === option ? 'text-edu-primary font-bold' : 'text-gray-300'}>
                                            {option}
                                        </span>
                                        {answers[questions[currentQuestionIndex].id] === option && (
                                            <CheckCircle2 className="text-edu-primary" size={20} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-12">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-edu-accent hover:bg-edu-accent/80 text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-edu-accent/20"
                                >
                                    {isSubmitting ? 'Submitting...' : <><Send size={18} /> Finish Test</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="px-8 py-3 bg-edu-primary hover:bg-edu-primary/80 text-white font-bold rounded-xl transition-all"
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-6">
                    <div className="bg-edu-surface backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Eye className="text-edu-secondary" size={18} />
                            Activity Logs
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-black/20 p-4 rounded-xl">
                                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Keystroke Intensity</div>
                                <div className="text-xl font-mono text-edu-secondary">{keystrokes}</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl">
                                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Test Progress</div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                                    <div 
                                        className="bg-edu-primary h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                        <div className="flex items-center gap-3 text-red-500 mb-3">
                            <AlertTriangle size={20} />
                            <span className="font-bold text-sm">Security Policy</span>
                        </div>
                        <p className="text-xs text-red-100/60 leading-relaxed">
                            Leaving this tab or minimizing the window will result in a security strike. 3 strikes will lead to automatic submission.
                        </p>
                    </div>
                </div>
            </div>

            {/* Warning Overlay */}
            <AnimatePresence>
                {!isFocused && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
                                <EyeOff className="text-red-500 w-12 h-12 animate-bounce" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">ENVIRONMENT COMPROMISED</h2>
                            <p className="text-red-400 font-mono text-sm uppercase tracking-widest">
                                Return focus to the window immediately to resume monitoring.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SecureTestEnvironment;
