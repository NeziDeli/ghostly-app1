"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Sparkles, Lock, Users as UsersIcon } from "lucide-react";

interface CreateEventModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    location: { lat: number, lng: number };
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
                    // Prioritize City > Town > Village, then State/Country
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
        <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            {/* Modal Content - Compacted */}
            <div className="glass-panel w-full max-w-sm p-5 relative animate-slide-up md:animate-scale-in rounded-3xl border border-white/10 shadow-2xl bg-[#0a0a0c]/90">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                >
                    <X size={18} />
                </button>

                <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="text-[var(--ghost-accent)]" size={16} />
                    <h2 className="text-lg font-bold text-white tracking-tight">Drop Pin</h2>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/60 font-mono truncate max-w-[150px]">
                        {address || `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Title Input */}
                    <input
                        type="text"
                        required
                        placeholder="Event Name..."
                        className="w-full bg-white/5 border-b border-white/10 px-2 py-2 text-base font-semibold placeholder:text-white/30 focus:outline-none focus:border-[var(--ghost-primary)] focus:bg-transparent transition-all"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />

                    {/* Compact Type Selection grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {eventTypes.map(type => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, type: type.id });
                                    onTypeChange?.(type.id);
                                }}
                                className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all ${formData.type === type.id
                                    ? "bg-[var(--ghost-primary)] border-[var(--ghost-primary)] text-white"
                                    : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                            >
                                <span>{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Description */}
                    <textarea
                        required
                        placeholder="What's the vibe?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--ghost-primary)] resize-none h-16 text-xs transition-all placeholder:text-white/30"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    {/* Settings Row: Time | Guests | Privacy */}
                    <div className="grid grid-cols-[1.5fr_1fr_auto] gap-2">
                        {/* Time Input with Date Picker */}
                        <div>
                            <input
                                type="datetime-local"
                                required
                                min={`${new Date().toISOString().slice(0, 10)}T00:00`}
                                max={`${new Date().getFullYear() + 1}-12-31T23:59`}
                                className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[var(--ghost-primary)] [color-scheme:dark]"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        {/* Guest Limit */}
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="Max"
                                min="1"
                                className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-2 text-center text-xs focus:outline-none focus:border-[var(--ghost-primary)] placeholder:text-white/30"
                                value={formData.maxAttendees}
                                onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })}
                            />
                        </div>

                        {/* Privacy Toggle */}
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                            className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-center gap-2 ${formData.isPrivate
                                ? "bg-red-500/20 border-red-500/50 text-red-200"
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            <Lock size={14} />
                            <span className="text-xs font-medium">{formData.isPrivate ? "Private" : "Public"}</span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-1 flex items-center justify-center gap-2 text-sm"
                    >
                        Create Pin
                    </button>

                </form>
            </div>
        </div>
    );
}
