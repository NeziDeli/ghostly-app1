"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

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

    return (
        <div className="container min-h-screen pt-8 pb-24">
            <h1 className="text-xl font-bold mb-6">Messages</h1>

            {activeChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <MessageCircle size={48} className="mb-4" />
                    <p>No spirits have spoken yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {activeChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/messages/${chat.id}`}
                            className="glass-panel p-4 flex items-center gap-4 hover:bg-[var(--ghost-surface-hover)] transition-colors"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
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
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <h3 className="font-bold truncate items-center flex gap-2">
                                        {chat.name}
                                        {chat.isEvent && <span className="text-[10px] bg-[var(--ghost-primary)] text-black px-1.5 rounded-full">EVENT</span>}
                                    </h3>
                                    <span className="text-xs text-[var(--ghost-text-muted)]">
                                        {new Date(chat.lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--ghost-text-muted)] truncate">
                                    {chat.lastMsg.senderId === currentUser?.id ? 'You: ' : ''}{chat.lastMsg.content}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
