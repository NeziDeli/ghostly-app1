import { useState, useEffect } from "react";
import { X, MapPin, Sparkles, Lock } from "lucide-react";

interface CreateEventModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    location: { lat: number, lng: number };
    screenCoords?: { x: number, y: number } | null;
    onTypeChange?: (type: string) => void;
}

export default function CreateEventModal({ onClose, onSubmit, location, onTypeChange }: CreateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        time: "",
        type: "chill",
        isPrivate: false,
        maxAttendees: ""
    });
    const [address, setAddress] = useState<string | null>(null);

    // Reverse Geocode
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`);
                const data = await res.json();
                if (data && data.address) {
                    const city = data.address.city || data.address.town || data.address.village || data.address.county;
                    const region = data.address.state || data.address.country;
                    setAddress(`${city ? city + ', ' : ''}${region}`);
                }
            } catch (e) {
                console.error("Failed to fetch address", e);
            }
        };
        fetchAddress();
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined
        });
    };

    const eventTypes = [
        { id: "chill", label: "Chill", icon: "☕" },
        { id: "party", label: "Party", icon: "🎉" },
        { id: "food", label: "Food", icon: "🍔" },
        { id: "study", label: "Focus", icon: "📚" },
        { id: "sport", label: "Active", icon: "⚽" },
        { id: "music", label: "Music", icon: "🎵" },
    ];

    return (
        <div className="fixed inset-0 z-[2000] pointer-events-none flex flex-col justify-end md:justify-center md:items-end md:pb-8 md:pr-8">
            {/* Backdrop for mobile focus? Optional. Let's keep it clean. */}

            {/* Card Container */}
            <div className="w-full md:w-96 p-4 md:p-0 pointer-events-auto animate-slide-up-fade">
                <div className="glass-panel w-full p-5 relative rounded-t-3xl md:rounded-2xl border-t md:border border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[0_0_50px_rgba(138,124,255,0.2)] bg-[#0a0a0c] md:bg-[#0a0a0c]/90 backdrop-blur-xl overflow-hidden pb-8 md:pb-5">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-4 flex items-center gap-2">
                        <div className="p-1.5 bg-[var(--ghost-accent)]/20 rounded-lg text-[var(--ghost-accent)]">
                            <Sparkles size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">New Place Drop</h2>
                    </div>

                    <div className="mb-5">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1 block flex items-center gap-1.5">
                            <MapPin size={12} />
                            {address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Title Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider ml-1">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="Name your event..."
                                autoFocus
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-white/30 focus:outline-none focus:border-[var(--ghost-primary)] focus:bg-white/5 transition-all"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Event Types - Horizontal Scroll */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider ml-1">Vibe</label>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {eventTypes.map(type => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, type: type.id });
                                            onTypeChange?.(type.id);
                                        }}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all whitespace-nowrap ${formData.type === type.id
                                            ? "bg-[var(--ghost-primary)] border-white text-white shadow-[0_0_15px_var(--ghost-primary-glow)] scale-105"
                                            : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                                            }`}
                                    >
                                        <span>{type.icon}</span>
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider ml-1">Details</label>
                            <textarea
                                required
                                placeholder="What's happening?"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--ghost-primary)] resize-none h-20 text-xs transition-all placeholder:text-white/30"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Compact Settings */}
                        <div className="flex gap-3">
                            <input
                                type="datetime-local"
                                required
                                min={`${new Date().toISOString().slice(0, 10)}T00:00`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[var(--ghost-primary)] [color-scheme:dark]"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${formData.isPrivate
                                    ? "bg-red-500/20 border-red-500/50 text-red-200"
                                    : "bg-white/5 border-white/10 text-white/60"
                                    }`}
                            >
                                <Lock size={12} />
                                {formData.isPrivate ? "Private" : "Public"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--ghost-primary)] text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-2 text-sm"
                        >
                            Drop Pin
                        </button>

                        {/* Safe Area Spacer for Mobile */}
                        <div className="h-4 md:hidden" />
                    </form>
                </div>
            </div>
        </div>
    );
}
