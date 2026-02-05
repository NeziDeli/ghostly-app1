"use client";

import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Ghost, MoreVertical, ShieldAlert, Ban } from "lucide-react";

export default function ChatPage() {
    const { id } = useParams() as { id: string };
    const { nearbyUsers, events, messages, sendMessage, currentUser, leaveEvent, connections, blockUser, unblockUser, reportUser } = useStore();
    const router = useRouter();
    const [input, setInput] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const user = nearbyUsers.find(u => u.id === id);
    const event = events.find(e => e.id === id);

    // Determine chat target (User or Event)
    const target = user ? {
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        initial: user.name[0],
        type: 'user'
    } : event ? {
        name: event.title,
        avatar: '#333',
        status: `${event.attendees.length} members`,
        initial: event.type === 'chill' ? '☕' : '📍',
        type: 'event'
    } : null;

    // Determine Thread ID
    let threadId = id;
    if (target?.type === 'user' && currentUser) {
        threadId = [currentUser.id, id].sort().join('-');
    }

    const conversation = messages[threadId] || [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(id, input);
        setInput("");
    };

    const handleLeave = () => {
        if (confirm("Are you sure you want to leave this group?")) {
            leaveEvent(id);
            router.push('/messages');
        }
    };

    const handleSummon = () => {
        sendMessage(id, "👻 SUMMONED YOU!", 'summon');
    };

    const handleBlock = () => {
        if (confirm(`Are you sure you want to block ${target?.name}? You won't receive messages from them anymore.`)) {
            blockUser(id);
            setShowMenu(false);
            router.push('/messages');
        }
    };

    const handleReport = () => {
        const reason = prompt("Why are you reporting this user?");
        if (reason) {
            reportUser(id, reason);
            setShowMenu(false);
        }
    };

    // Access Control: If it's an event, user must be an attendee
    if (target?.type === 'event' && event && !event.attendees.includes(currentUser?.id || '')) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[var(--ghost-bg)] p-8 text-center">
                <div className="text-4xl mb-4">🚫</div>
                <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                <p className="text-[var(--ghost-text-muted)] mb-6">
                    You are no longer a member of this group.
                </p>
                <button
                    onClick={() => router.push('/messages')}
                    className="bg-[var(--ghost-primary)] text-black font-bold py-2 px-6 rounded-full"
                >
                    Back to Messages
                </button>
            </div>
        );
    }

    if (!target) return <div className="p-8 text-center">Chat not found</div>;

    const isSoulbound = user ? connections[user.id] === 'soulbound' : false;
    const isBlocked = currentUser?.blockedUsers?.includes(id);

    return (
        <div className="flex flex-col h-screen bg-[var(--ghost-bg)]">
            {/* Header */}
            <header className="p-4 glass-panel border-b-0 rounded-none z-10 flex items-center justify-between shrink-0 relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            {target.avatar && target.avatar.startsWith('http') ? (
                                <img
                                    src={target.avatar}
                                    alt={target.name}
                                    className="w-10 h-10 rounded-full object-cover bg-[var(--ghost-surface)] ring-2 ring-[var(--ghost-primary)]/50"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ring-2 ring-white/20 shadow-lg"
                                    style={{ backgroundColor: target.avatar }}
                                >
                                    {target.initial}
                                </div>
                            )}
                            {target.type === 'user' && (
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0c] ${target.status === 'online' ? 'bg-green-400' : 'bg-gray-500'}`} />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold leading-tight flex items-center gap-2">
                                {target.name}
                                {target.type === 'event' && <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-sm">EVENT</span>}
                            </h3>
                            <span className="text-xs text-[var(--ghost-text-muted)] flex items-center gap-1">
                                {isSoulbound && <span className="text-yellow-400">✨ Soulbound</span>}
                                {!isSoulbound && target.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {target.type === 'event' ? (
                        <button
                            onClick={handleLeave}
                            className="text-xs font-bold text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                        >
                            Leave
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 -mr-2 text-[var(--ghost-text-muted)] hover:text-white transition-colors"
                            >
                                <MoreVertical size={24} />
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1f] border border-[var(--ghost-border)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
                                    <button
                                        onClick={handleReport}
                                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors text-yellow-400"
                                    >
                                        <ShieldAlert size={16} />
                                        <span className="text-sm font-medium">Report User</span>
                                    </button>
                                    <button
                                        onClick={handleBlock}
                                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors text-red-400"
                                    >
                                        <Ban size={16} />
                                        <span className="text-sm font-medium">{isBlocked ? 'Unblock User' : 'Block User'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-6"
                style={{ backgroundImage: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.03) 0%, transparent 70%)' }}
            >
                {conversation.map((msg, index) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const isSystem = msg.senderId === 'system';
                    const isSummon = msg.type === 'summon';

                    // Simple logic to group messages visually could go here, but keeping it simple for now
                    const showAvatar = !isMe && !isSystem;

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-2 animate-fade-in">
                                <span className="text-[10px] font-bold text-[var(--ghost-text-muted)] bg-white/5 border border-white/5 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                                    {msg.content}
                                </span>
                            </div>
                        );
                    }

                    const sender = nearbyUsers.find(u => u.id === msg.senderId);
                    const senderName = sender?.name || 'Unknown';
                    const senderAvatar = sender?.avatar || '#ccc';
                    const isImageAvatar = senderAvatar.startsWith('http');

                    return (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] group ${isMe ? 'self-end flex-row-reverse' : 'self-start'} animate-slide-up-fade`}>
                            {/* Avatar */}
                            {showAvatar && (
                                <div className="shrink-0 flex flex-col justify-end pb-1">
                                    {isImageAvatar ? (
                                        <img
                                            src={senderAvatar}
                                            alt={senderName}
                                            className="w-8 h-8 rounded-2xl object-cover bg-[var(--ghost-surface)] shadow-md"
                                        />
                                    ) : (
                                        <div
                                            className="w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-md"
                                            style={{ backgroundColor: senderAvatar }}
                                        >
                                            {senderName[0]}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div
                                className={`px-4 py-3 text-sm min-w-[60px] shadow-sm relative ${isMe
                                    ? "bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] text-white rounded-2xl rounded-tr-sm"
                                    : "bg-[#25252a] text-gray-100 rounded-2xl rounded-tl-sm border border-white/5"
                                    } ${isSummon ? 'border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.2)] animate-pulse' : ''}`}
                            >
                                {!isMe && target.type === 'event' && (
                                    <span className="text-[10px] font-bold block mb-1 opacity-70 text-purple-300">
                                        {senderName}
                                    </span>
                                )}
                                {isSummon && <div className="text-3xl mb-2 text-center drop-shadow-md">👻🔔</div>}
                                <p className={`leading-relaxed ${isSummon ? 'font-black text-center uppercase tracking-widest text-lg' : ''}`}>{msg.content}</p>
                                <span className={`text-[9px] mt-1.5 block text-right font-medium opacity-60`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input - Floating Capsule Style */}
            <div className="p-4 bg-transparent shrink-0 relative z-20">
                <form
                    onSubmit={handleSend}
                    className="glass-panel rounded-full p-1.5 flex items-center gap-2 shadow-2xl border border-white/10 bg-[#1a1a1f]/80 backdrop-blur-xl"
                >
                    {isBlocked ? (
                        <div className="w-full p-3 bg-red-900/10 rounded-full text-center flex items-center justify-center gap-2">
                            <Ban size={14} className="text-red-400" />
                            <p className="text-red-400 font-bold text-xs">Blocked</p>
                            <button
                                type="button"
                                onClick={() => unblockUser(id)}
                                className="text-xs underline text-white/50 hover:text-white ml-2"
                            >
                                Unblock
                            </button>
                        </div>
                    ) : (
                        <>
                            {isSoulbound && (
                                <button
                                    type="button"
                                    onClick={handleSummon}
                                    className="p-3 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20 transition-all active:scale-90 hover:rotate-12"
                                    title="Summon Soulbound"
                                >
                                    <Ghost size={20} className="drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                                </button>
                            )}

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isSoulbound ? "Whisper to your soulbound..." : `Message ${target.type === 'event' ? 'group' : target.name}...`}
                                className="flex-1 bg-transparent border-none px-3 py-2 focus:outline-none text-sm placeholder:text-white/20 font-medium"
                            />

                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-3 bg-[var(--ghost-primary)] rounded-full text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
