import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, Sparkles, GraduationCap } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { chatService } from "../services/chatService";

type Message = {
    text: string;
    sender: "user" | "educator" | "system";
    time: string;
};

const TeacherChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { text: "Secure Educational Uplink Active.", sender: "system", time: new Date().toLocaleTimeString() },
        { text: "Professor is online. How can I help with your test today?", sender: "educator", time: new Date().toLocaleTimeString() }
    ]);
    const { socket, isConnected } = useSocket();
    const { currentUser } = useAuth();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isOpen]);

    // Load History
    useEffect(() => {
        if (!currentUser) return;

        const loadHistory = async () => {
            try {
                const history = await chatService.getChatHistory(currentUser.uid);
                const mapped: Message[] = history.map((m: any) => ({
                    text: m.text,
                    sender: m.sender === 'educator' ? 'educator' : 'user',
                    time: new Date(m.timestamp).toLocaleTimeString()
                }));

                if (mapped.length > 0) {
                    setChatHistory(mapped);
                }
            } catch (err) {
                console.error("Failed to load chat history", err);
            }
        };
        loadHistory();
    }, [currentUser]);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data: any) => {
            setChatHistory((prev) => [
                ...prev,
                { text: data.message, sender: "educator", time: new Date().toLocaleTimeString() },
            ]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

    const handleSend = () => {
        if (!message.trim() || !socket || !currentUser) return;

        const msgData = {
            room: currentUser.uid,
            message: message,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "Unknown Student",
        };

        socket.emit("send_message", msgData);

        setChatHistory((prev) => [
            ...prev,
            { text: message, sender: "user", time: new Date().toLocaleTimeString() },
        ]);
        setMessage("");
    };

    if (!currentUser) return null; 

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        className="w-80 md:w-96 h-[500px] bg-edu-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-3xl border-l-4 border-l-edu-secondary"
                    >
                        {/* Header */}
                        <div className="bg-edu-surface p-4 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-edu-secondary/10 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="text-edu-secondary" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Live Support</div>
                                    <div className="text-sm font-bold text-white leading-none">Educator Panel</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === "user"
                                                ? "bg-edu-primary text-white"
                                                : msg.sender === "system"
                                                ? "text-gray-500 italic text-[10px] w-full text-center py-2 bg-white/5 rounded-full"
                                                : "bg-edu-surface text-gray-200 border border-white/5"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.sender !== "system" && (
                                        <span className="text-[9px] text-gray-600 mt-1 font-mono uppercase px-2">
                                            {msg.time}
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-edu-surface border-t border-white/5">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask a doubt..."
                                    className="flex-1 bg-edu-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-edu-secondary transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className="p-3 bg-edu-secondary hover:bg-edu-secondary/80 text-black rounded-xl transition-all shadow-lg shadow-edu-secondary/20 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[22px] flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isOpen
                        ? "bg-white text-black rotate-90"
                        : "bg-edu-secondary text-black shadow-edu-secondary/30"
                }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                
                {/* Notification Badge */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-edu-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-edu-accent border-2 border-edu-dark flex items-center justify-center text-[10px] font-bold">1</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default TeacherChatWidget;
