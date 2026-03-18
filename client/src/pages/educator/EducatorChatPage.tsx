import { useState, useEffect, useRef } from "react";
import { Send, User, ChevronLeft, Globe, MessageSquare, ShieldCheck, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { chatService } from "../../services/chatService";

type Message = {
    text: string;
    sender: "user" | "educator" | "system";
    time: string;
    timestamp?: string;
};

type Contact = {
    userId: string;
    socketId?: string;
    lastActive: string;
    hasUnread: boolean;
    lastMessage?: string;
};

const EducatorChatPage = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
    const [inputText, setInputText] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const users = await chatService.getActiveUsers();
                const mapped: Contact[] = users.map((u: any) => ({
                    userId: u.userId,
                    lastActive: new Date(u.lastActive).toLocaleTimeString(),
                    hasUnread: u.hasUnread,
                    lastMessage: u.lastMessage,
                }));
                setContacts(mapped);
            } catch (error) {
                console.error("Failed to load contacts", error);
            }
        };
        loadContacts();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("user_active", (data) => {
            if (data.userId === "educator") return;

            setContacts((prev) => {
                const existing = prev.find((u) => u.userId === data.userId);
                if (existing) {
                    return prev.map((u) => u.userId === data.userId ? { ...u, socketId: data.socketId } : u);
                }
                return [
                    {
                        userId: data.userId,
                        socketId: data.socketId,
                        lastActive: new Date().toLocaleTimeString(),
                        hasUnread: true,
                    },
                    ...prev,
                ];
            });
        });

        socket.on("admin_receive_message", (data) => {
            if (data.senderId === "educator") return;

            setContacts((prev) => {
                const existing = prev.find((u) => u.userId === data.senderId);
                const isSelected = selectedUser?.userId === data.senderId;

                if (existing) {
                    return prev.map((u) => u.userId === data.senderId ? {
                        ...u,
                        hasUnread: !isSelected,
                        lastActive: new Date().toLocaleTimeString(),
                        lastMessage: data.message,
                    } : u);
                }
                return [
                    {
                        userId: data.senderId,
                        socketId: socket.id || "",
                        lastActive: new Date().toLocaleTimeString(),
                        hasUnread: true,
                        lastMessage: data.message,
                    },
                    ...prev,
                ];
            });

            const newMessage: Message = {
                text: data.message,
                sender: "user",
                time: new Date().toLocaleTimeString(),
            };

            setMessages((prev) => ({
                ...prev,
                [data.senderId]: [...(prev[data.senderId] || []), newMessage],
            }));
        });

        return () => {
            socket.off("user_active");
            socket.off("admin_receive_message");
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchHistory = async () => {
            if (messages[selectedUser.userId] && messages[selectedUser.userId].length > 0) return;

            try {
                const history = await chatService.getChatHistory(selectedUser.userId);
                const mappedMessages: Message[] = history.map((m: any) => ({
                    text: m.text,
                    sender: m.sender === "educator" ? "educator" : "user",
                    time: new Date(m.timestamp).toLocaleTimeString(),
                    timestamp: m.timestamp,
                }));

                setMessages((prev) => ({
                    ...prev,
                    [selectedUser.userId]: mappedMessages,
                }));

                if (selectedUser.hasUnread) {
                    await chatService.markRead(selectedUser.userId);
                    setContacts((prev) => prev.map((u) => u.userId === selectedUser.userId ? { ...u, hasUnread: false } : u));
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();
    }, [selectedUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUser]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedUser || !socket) return;

        const msgData = {
            room: selectedUser.userId,
            message: inputText,
            senderId: "educator",
            senderName: "Educator Support",
        };

        socket.emit("send_message", msgData);

        const newMessage: Message = {
            text: inputText,
            sender: "educator",
            time: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => ({
            ...prev,
            [selectedUser.userId]: [...(prev[selectedUser.userId] || []), newMessage],
        }));

        setInputText("");
    };

    return (
        <div className="min-h-screen bg-edu-dark text-white font-sans relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-edu-secondary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="relative z-30 border-b border-white/5 bg-edu-surface/50 backdrop-blur-xl p-4 md:p-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate("/educator/dashboard")}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/5 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3">
                            <MessageSquare className="text-edu-secondary" size={24} />
                            COMMUNICATION HUB
                        </h1>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Academic Support Channel Active
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="bg-edu-secondary/10 border border-edu-secondary/20 px-4 py-1.5 rounded-full text-edu-secondary text-[10px] font-bold tracking-widest uppercase">
                        Operator: Educator Panel
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar - Student List */}
                <div className={`w-full md:w-96 border-r border-white/5 bg-edu-surface/30 backdrop-blur-3xl flex flex-col absolute md:relative inset-0 z-20 md:z-auto transition-transform duration-500 ${selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}`}>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">
                            Active Student Uplinks
                            <span className="bg-edu-primary/20 text-edu-primary px-2 py-0.5 rounded-md">{contacts.length}</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-edu-primary transition-all"
                                placeholder="Search students..."
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {contacts.length === 0 ? (
                            <div className="p-12 text-center space-y-4">
                                <Users size={40} className="mx-auto text-gray-800" />
                                <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Scanning for incoming signals...</p>
                            </div>
                        ) : (
                            contacts.map((user) => (
                                <button
                                    key={user.userId}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full p-6 flex items-center gap-4 border-b border-white/5 transition-all text-left relative group ${selectedUser?.userId === user.userId ? "bg-edu-primary/10 border-l-4 border-l-edu-primary" : "hover:bg-white/5 border-l-4 border-l-transparent"}`}
                                >
                                    <div className="w-12 h-12 bg-edu-dark border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-edu-surface transition-colors">
                                        <User size={20} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="font-bold text-sm truncate uppercase tracking-tight">Student {user.userId.slice(-6)}</div>
                                            <div className="text-[10px] text-gray-600 font-mono">{user.lastActive}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 truncate italic">
                                            {user.lastMessage || "Awaiting query..."}
                                        </div>
                                    </div>
                                    {user.hasUnread && (
                                        <div className="w-3 h-3 bg-edu-accent rounded-full shadow-[0_0_10px_#fbb60e]" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-edu-dark/20 relative w-full ${!selectedUser ? "hidden md:flex" : "flex"}`}>
                    {!selectedUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-1000">
                            <div className="relative">
                                <Globe size={120} className="text-edu-primary opacity-10 animate-[spin_20s_linear_infinite]" />
                                <ShieldCheck size={40} className="text-edu-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight">CENTRAL COMMS CONSOLE</h3>
                                <p className="text-gray-600 text-sm max-w-xs font-mono uppercase tracking-widest">Select a student uplink to establish secure communication protocol.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-white/5 bg-edu-surface/50 backdrop-blur-xl flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="md:hidden p-2 bg-white/5 rounded-xl hover:bg-white/10"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 bg-edu-secondary/10 rounded-xl flex items-center justify-center">
                                        <User size={18} className="text-edu-secondary" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg leading-none mb-1">UPLINK: STUDENT {selectedUser.userId.slice(-6)}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Connection Stable // Low Latency</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                {(messages[selectedUser.userId] || []).map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === "educator" ? "items-end" : "items-start"}`}
                                    >
                                        <div className={`max-w-[80%] md:max-w-[60%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-xl ${
                                            msg.sender === "educator"
                                                ? "bg-edu-primary text-white rounded-tr-none"
                                                : "bg-edu-surface text-gray-200 border border-white/5 rounded-tl-none"
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-gray-700 mt-2 font-mono uppercase px-2 font-bold tracking-widest">
                                            {msg.sender.toUpperCase()} • {msg.time}
                                        </span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 border-t border-white/5 bg-edu-surface/50 backdrop-blur-xl">
                                <div className="max-w-4xl mx-auto flex gap-4">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Transmit response to student..."
                                        className="flex-1 bg-edu-dark border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-edu-secondary focus:outline-none transition-all shadow-inner"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="px-8 py-4 bg-edu-secondary text-black font-black rounded-2xl hover:bg-edu-secondary/80 transition-all flex items-center gap-3 shadow-xl shadow-edu-secondary/20 group"
                                    >
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                        <span className="hidden md:inline font-bold tracking-widest">TRANSMIT</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EducatorChatPage;
