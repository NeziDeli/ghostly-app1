"use client";

import { useStore } from "@/lib/store";
import { MapPin, MessageSquare, UserPlus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import StoryCircle from "@/components/StoryCircle";
import CreateStoryModal from "@/components/CreateStoryModal";
import StoryViewer from "@/components/StoryViewer";

export default function FeedPage() {
    const { nearbyUsers, currentUser, connections, sendRequest, stories } = useStore();
    const [search, setSearch] = useState("");
    const [isCreatingStory, setIsCreatingStory] = useState(false);
    const [viewingStories, setViewingStories] = useState<{ userId: string; initialIndex: number } | null>(null);

    // Filter users
    const filteredUsers = nearbyUsers.filter(user => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term) ||
            user.interests.some(i => i.toLowerCase().includes(term))
        );
    });

    // Group stories by user (mock logic: just get latest valid story per user)
    const activeStories = stories.filter(story => {
        const isExpired = new Date(story.timestamp).getTime() < Date.now() - (24 * 60 * 60 * 1000);
        return !isExpired;
    });

    // Get unique users with active stories
    const usersWithStories = Array.from(new Set(activeStories.map(s => s.userId)))
        .map(userId => nearbyUsers.find(u => u.id === userId))
        .filter((u) => !!u);

    // Helpers for Viewing
    const handleViewStory = (userId: string) => {
        setViewingStories({ userId, initialIndex: 0 });
    };

    const storiesForViewer = viewingStories
        ? activeStories
            .filter(s => s.userId === viewingStories.userId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        : [];

    // Find user for viewer
    const viewingUser = viewingStories
        ? nearbyUsers.find(u => u.id === viewingStories.userId) || currentUser
        : null;


    return (
        <div className="container min-h-screen pb-24 pt-8 animate-fade-in">
            {/* Header & Search */}
            <header className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="text-xl font-bold mb-3 is-sticky text-shadow-sm transition-all">
                    {search ? "Global Search" : "Nearby"}
                </h1>

                <div className="relative hover-scale">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ghost-text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or interest..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-full pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--ghost-primary)] transition-all duration-300"
                    />
                </div>
            </header>

            {/* Stories */}
            <section className="mb-8 overflow-x-auto no-scrollbar pb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex gap-4">
                    {/* My Story Placeholder */}
                    {currentUser && (
                        <StoryCircle
                            user={currentUser}
                            hasUnseen={false}
                            onClick={() => setIsCreatingStory(true)}
                        />
                    )}

                    {usersWithStories.map(user => (
                        <StoryCircle
                            key={user.id}
                            user={user}
                            hasUnseen={true}
                            onClick={() => handleViewStory(user.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Users List */}
            <div className="flex flex-col gap-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-[var(--ghost-text-muted)] animate-pulse">
                        No spirits found globally matching "{search}"
                    </div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="glass-panel p-4 flex items-center gap-4 hover:bg-[var(--ghost-surface-hover)] transition-all duration-300 hover-scale hover-glow animate-fade-in-up"
                            style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 relative"
                                style={{ backgroundColor: user.avatar }}
                            >
                                {user.name[0]}
                                {/* Online Indicator */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--status-online)] rounded-full border-2 border-[var(--ghost-surface)] shadow-[0_0_10px_var(--status-online)]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold truncate">{user.name}</h3>
                                    <span className="text-xs text-[var(--ghost-text-muted)] flex items-center gap-1">
                                        <MapPin size={12} /> 0.5km
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--ghost-text-muted)] truncate">{user.bio}</p>

                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {user.interests.map(interest => (
                                        <span key={interest} className="text-[10px] bg-[rgba(255,255,255,0.1)] px-2 py-0.5 rounded-full">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                                {connections[user.id] ? (
                                    <Link
                                        href={`/messages/${user.id}`}
                                        className="p-2 bg-[var(--ghost-surface)] rounded-full hover:bg-[var(--ghost-primary)] transition-colors active:scale-90"
                                    >
                                        <MessageSquare size={18} />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => sendRequest(user.id)}
                                        className="p-2 bg-[var(--ghost-surface)] rounded-full hover:bg-[var(--ghost-accent)] hover:text-black transition-colors active:scale-90"
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            {
                isCreatingStory && (
                    <CreateStoryModal onClose={() => setIsCreatingStory(false)} />
                )
            }

            {
                viewingStories && viewingUser && (
                    <StoryViewer
                        stories={storiesForViewer}
                        user={viewingUser}
                        initialStoryIndex={viewingStories.initialIndex}
                        onClose={() => setViewingStories(null)}
                        onComplete={() => setViewingStories(null)}
                    />
                )
            }
        </div >
    );
}
