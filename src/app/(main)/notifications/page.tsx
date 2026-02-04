"use client";

import { useStore } from "@/lib/store";
import { User, Check, X, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const { currentUser, events, nearbyUsers, approveRequest } = useStore();
    const router = useRouter();

    if (!currentUser) return null;

    // Get events hosted by current user that have pending requests
    const myEvents = events.filter(e => e.hostId === currentUser.id);

    // Flatten requests: { eventId, userId, eventTitle }
    const requests = myEvents.flatMap(event =>
        event.pendingRequests.map(userId => ({
            eventId: event.id,
            eventTitle: event.title,
            userId
        }))
    );

    const getUser = (userId: string) => nearbyUsers.find(u => u.id === userId);

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white p-4 pb-24 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-4">
                <h1 className="text-3xl font-black tracking-tighter">Notifications</h1>
                <div className="p-2 bg-white/5 rounded-full relative">
                    <Bell size={20} />
                    {requests.length > 0 && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0c]" />
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <Bell size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">No new notifications</p>
                    </div>
                ) : (
                    requests.map((req) => {
                        const user = getUser(req.userId);
                        if (!user) return null;

                        return (
                            <div key={`${req.eventId}-${req.userId}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-[var(--ghost-primary)]">
                                        {/* Avatar placeholder */}
                                        <div className="w-full h-full flex items-center justify-center font-bold text-lg">
                                            {user.name[0]}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">
                                            {user.name} <span className="text-white/50 font-normal">requested to join</span>
                                        </p>
                                        <p className="text-xs text-[var(--ghost-accent)] font-medium mt-0.5">
                                            {req.eventTitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => approveRequest(req.eventId, req.userId)}
                                        className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                    </button>
                                    <button
                                        // For now, "decline" could just not approve (or we add a decline action later)
                                        // For MVP, we might just leave it pending or implement decline
                                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                                    >
                                        <X size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
