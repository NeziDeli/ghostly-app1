"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
    const { messages, nearbyUsers, events, currentUser } = useStore();

    // Get users/events involved in chats
    // Get users/events involved in chats
    const activeChats = Object.keys(messages).map(threadId => {
        const msgs = messages[threadId];
        const lastMsg = msgs[msgs.length - 1];
        if (!lastMsg) return null; // Should not happen

        // Check for Event (Simple ID)
        const event = events.find(e => e.id === threadId);
        if (event) {
            // Check if user is still a member
            if (!event.attendees.includes(currentUser?.id || '')) {
                return null; // Skip this chat if user left
            }
            return {
                id: event.id,
                name: event.title,
                avatar: null, // Logic to handle event icon
                isEvent: true,
                type: event.type,
                lastMsg
            };
        }

        // Check for DM (Composite ID: userA-userB)
        // We need to find the "other" user ID
        // Format: [id1, id2].sort().join('-')
        if (threadId.includes('-')) {
            const parts = threadId.split('-');
            const otherUserId = parts.find(p => p !== currentUser?.id);

            if (otherUserId) {
                const user = nearbyUsers.find(u => u.id === otherUserId) ||
                    // Fallback for mock users if not in "nearby" list purely? 
                    // For now assume nearbyUsers contains all relevant connectable users
                    { id: otherUserId, name: 'Unknown Spirit', avatar: '#ccc' } as any;

                return {
                    id: user.id, // Route to /messages/userId NOT threadId
                    name: user.name,
                    avatar: user.avatar,
                    isEvent: false,
                    type: 'user',
                    lastMsg
                };
            }
        }

        return null; // Fallback
    }).filter((chat): chat is NonNullable<typeof chat> => chat !== null).sort((a, b) => new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime());

    const [search, setSearch] = useState("");

    // Filter users for search
    const searchResults = search.trim() ? nearbyUsers.filter(u =>
        u.id !== currentUser?.id && (
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
        )
    ) : [];

    return (
        <div className="container min-h-screen pt-8 pb-24 animate-fade-in">
            <h1 className="text-xl font-bold mb-6">Messages</h1>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ghost-text-muted)]" size={18} />
                <input
                    type="text"
                    placeholder="Find a soul..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-full pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--ghost-primary)] transition-all duration-300 placeholder:text-white/20"
                />
            </div>

            {search.trim() ? (
                // Search Results View
                <div className="flex flex-col gap-2">
                    <h2 className="text-xs font-bold text-[var(--ghost-text-muted)] uppercase tracking-wider mb-2 ml-1">
                        Results ({searchResults.length})
                    </h2>
                    {searchResults.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            No spirits found matching "{search}"
                        </div>
                    ) : (
                        searchResults.map(user => (
                            <Link
                                key={user.id}
                                href={`/messages/${user.id}`}
                                className="glass-panel p-3 flex items-center gap-3 hover:bg-[var(--ghost-surface-hover)] transition-colors group"
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                    style={{ backgroundColor: user.avatar || '#333' }}
                                >
                                    {user.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold truncate text-sm">{user.name}</h3>
                                    <p className="text-xs text-[var(--ghost-text-muted)] truncate">@{user.username || 'ghost'}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[var(--ghost-primary)] group-hover:text-black transition-colors">
                                    <MessageCircle size={16} />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            ) : (
                // Active Chats View
                <>
                    {activeChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50 animate-fade-in">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                                <MessageCircle size={32} className="text-white/50" />
                                <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                            </div>
                            <p className="font-bold text-white/80">No whispers yet...</p>
                            <p className="text-xs mt-2 text-[var(--ghost-text-muted)] max-w-[200px] text-center">
                                Start a chat with a friend or join a nearby group event.
                            </p>
                            <button
                                onClick={() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()}
                                className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-colors"
                            >
                                Find Connections
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[10px] font-bold text-[var(--ghost-text-muted)] uppercase tracking-widest mb-2 ml-1 opacity-70">
                                Recent Chats
                            </h2>
                            {activeChats.map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/messages/${chat.id}`}
                                    className="p-4 flex items-center gap-4 hover:bg-white/5 transition-all rounded-2xl border border-transparent hover:border-white/10 group relative overflow-hidden"
                                >
                                    {/* Unread dot simulation (random for now or derived if logic existed) */}
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg relative z-10"
                                        style={{ backgroundColor: chat.avatar || '#333' }}
                                    >
                                        {chat.isEvent ? (
                                            <span>
                                                {chat.type === 'chill' ? '☕' :
                                                    chat.type === 'party' ? '🎉' :
                                                        chat.type === 'food' ? '🍔' :
                                                            chat.type === 'study' ? '📚' :
                                                                chat.type === 'sport' ? '⚽' : '📍'}
                                            </span>
                                        ) : (
                                            chat.name[0]
                                        )}
                                        {/* Status Dot */}
                                        {!chat.isEvent && (
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0a0a0c] rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 relative z-10">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold truncate items-center flex gap-2 text-sm group-hover:text-[var(--ghost-primary)] transition-colors">
                                                {chat.name}
                                                {chat.isEvent && <span className="text-[9px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded-full">GROUP</span>}
                                            </h3>
                                            <span className="text-[10px] font-medium text-[var(--ghost-text-muted)]">
                                                {new Date(chat.lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--ghost-text-muted)] truncate group-hover:text-white/70 transition-colors">
                                            {chat.lastMsg.senderId === currentUser?.id ? <span className="opacity-50">You: </span> : ''}
                                            {chat.lastMsg.content}
                                        </p>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
