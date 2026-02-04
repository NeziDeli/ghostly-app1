"use client";

import { X, Users, Clock, MapPin, Sparkles, Lock } from "lucide-react";
import { Event } from "@/lib/types";

interface EventDetailsModalProps {
    event: Event;
    onClose: () => void;
    onJoin: () => void;
    position?: { x: number; y: number };
}

import { useStore } from "@/lib/store";

interface EventDetailsModalProps {
    event: Event;
    onClose: () => void;
    onJoin: () => void;
    position?: { x: number; y: number };
}

export default function EventDetailsModal({ event, onClose, onJoin, position }: EventDetailsModalProps) {
    const { currentUser } = useStore();

    // Derived States
    const isHost = currentUser?.id === event.hostId;
    const isAttendee = currentUser ? event.attendees.includes(currentUser.id) : false;
    const isPending = currentUser ? event.pendingRequests.includes(currentUser.id) : false;
    const isFull = event.maxAttendees ? event.attendees.length >= event.maxAttendees : false;

    // Button Logic
    let buttonText = "Join Event";
    let isButtonDisabled = false;
    let buttonAction = onJoin;

    if (isHost) {
        buttonText = "Hosting";
        isButtonDisabled = true;
    } else if (isAttendee) {
        buttonText = "Joined";
        isButtonDisabled = true;
    } else if (isPending) {
        buttonText = "Requested";
        isButtonDisabled = true;
    } else if (isFull) {
        buttonText = "Event Full";
        isButtonDisabled = true;
    } else if (event.isPrivate) {
        buttonText = "Request Create"; // "Request to Join" might be too long for mobile bubble
        buttonText = "Request Join";
    }

    // Calculate position styles
    const style: React.CSSProperties = position ? {
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-20px)', // Center horizontally above, move up slightly
        margin: 0
    } : {};

    const containerClasses = position
        ? "z-[2000] w-[280px] animate-scale-in origin-bottom"
        : "fixed inset-0 z-[2000] flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in";

    return (
        <div className={containerClasses} style={style}>
            {/* Bubble Content */}
            <div className={`glass-panel w-full p-4 relative rounded-2xl border border-white/10 shadow-2xl bg-[#0a0a0c]/95 backdrop-blur-xl ${position ? '' : 'max-w-sm md:rounded-3xl'}`}>
                {/* Pointer Arrow if positioned */}
                {position && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0a0c]/95 border-b border-r border-white/10 rotate-45 transform" />
                )}

                {/* Drag Handle for Mobile (only if not positioned) */}
                {!position && <div className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />}


                {/* Glow Effect based on type */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-[var(--ghost-primary)] opacity-20 blur-[80px] rounded-full pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                >
                    <X size={22} />
                </button>

                {/* Header */}
                <div className="mb-4 pr-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{
                            event.type === 'chill' ? '☕' :
                                event.type === 'party' ? '🎉' :
                                    event.type === 'food' ? '🍔' :
                                        event.type === 'study' ? '📚' :
                                            event.type === 'sport' ? '⚽' : '🎵'
                        }</span>
                        <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{event.title}</h2>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                        <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                            <Clock size={12} /> {event.time}
                        </span>
                        {event.isPrivate && (
                            <span className="flex items-center gap-1 bg-red-500/10 text-red-300 px-2 py-1 rounded-full border border-red-500/20">
                                <Lock size={12} /> Private
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
                    <p className="text-sm text-white/80 leading-relaxed">
                        {event.description}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-[var(--ghost-primary)]/20 p-2 rounded-lg text-[var(--ghost-accent)]">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold">People</p>
                            <p className="text-sm font-bold text-white">
                                {event.attendees.length}
                                <span className="text-white/40 font-normal"> / {event.maxAttendees || '∞'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-white/50 uppercase tracking-wider font-bold">Status</p>
                        <p className={`text-sm font-bold ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                            {isFull ? 'Full House' : 'Open'}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={buttonAction}
                    disabled={isButtonDisabled}
                    className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isButtonDisabled
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
