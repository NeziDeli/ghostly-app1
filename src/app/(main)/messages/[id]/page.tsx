"use client";

import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Ghost } from "lucide-react";

export default function ChatPage() {
    const { id } = useParams() as { id: string };
    const { nearbyUsers, events, messages, sendMessage, currentUser, leaveEvent, connections } = useStore();
    const router = useRouter();
    const [input, setInput] = useState("");
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

    return (
        <div className="flex flex-col h-screen bg-[var(--ghost-bg)]">
            {/* Header */}
            <header className="p-4 glass-panel border-b-0 rounded-none z-10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        {target.avatar && target.avatar.startsWith('http') ? (
                            <img
                                src={target.avatar}
                                alt={target.name}
                                className="w-10 h-10 rounded-full object-cover bg-[var(--ghost-surface)]"
                            />
                        ) : (
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                                style={{ backgroundColor: target.avatar }}
                            >
                                {target.initial}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold leading-tight flex items-center gap-2">
                                {target.name}
                                {target.type === 'event' && <span className="text-[10px] bg-[var(--ghost-primary)] text-black px-1.5 rounded-full">EVENT</span>}
                            </h3>
                            <span className="text-xs text-[var(--ghost-text-muted)]">{target.status}</span>
                        </div>
                    </div>
                </div>

                {target.type === 'event' && (
                    <button
                        onClick={handleLeave}
                        className="text-xs font-bold text-red-500 border border-red-500/50 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                    >
                        Leave
                    </button>
                )}
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
            >
                {conversation.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const isSystem = msg.senderId === 'system';
                    const isSummon = msg.type === 'summon';

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-2">
                                <span className="text-xs text-[var(--ghost-text-muted)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full">
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
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                            {/* Avatar */}
                            {!isMe && (
                                <div className="shrink-0 flex flex-col justify-end">
                                    {isImageAvatar ? (
                                        <img
                                            src={senderAvatar}
                                            alt={senderName}
                                            className="w-8 h-8 rounded-full object-cover bg-[var(--ghost-surface)]"
                                        />
                                    ) : (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ backgroundColor: senderAvatar }}
                                        >
                                            {senderName[0]}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div
                                className={`p-3 rounded-2xl text-sm min-w-[60px] ${isMe
                                    ? "bg-[var(--ghost-primary)] rounded-br-none text-black font-medium"
                                    : "bg-[var(--ghost-surface)] rounded-bl-none"
                                    } ${isSummon ? 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-pulse' : ''}`}
                            >
                                {!isMe && target.type === 'event' && (
                                    <span className={`text-[10px] font-bold block mb-1 opacity-50 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                                        {senderName}
                                    </span>
                                )}
                                {isSummon && <div className="text-2xl mb-1 text-center">👻🔔</div>}
                                <p className={isSummon ? 'font-bold text-center uppercase tracking-widest' : ''}>{msg.content}</p>
                                <span className={`text-[10px] mt-1 block text-right ${isMe ? 'text-black/60' : 'opacity-50'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input - Add extra padding at bottom to clear Fixed Nav */}
            <form onSubmit={handleSend} className="p-4 glass-panel border-t-0 rounded-none shrink-0 pb-32">
                <div className="flex gap-2">
                    {isSoulbound && (
                        <button
                            type="button"
                            onClick={handleSummon}
                            className="p-3 bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 rounded-full hover:bg-yellow-400/30 transition-all active:scale-95"
                            title="Summon Soulbound"
                        >
                            <Ghost size={20} />
                        </button>
                    )}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${target.type === 'event' ? 'group' : target.name}...`}
                        className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[var(--ghost-border)] rounded-full px-4 py-3 focus:outline-none focus:border-[var(--ghost-primary)] text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 bg-[var(--ghost-primary)] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
