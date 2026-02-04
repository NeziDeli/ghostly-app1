import { useState, useEffect, useRef } from "react";
import { X, MapPin, Sparkles, Lock, Users as UsersIcon } from "lucide-react";

interface CreateEventModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    location: { lat: number, lng: number };
    screenCoords?: { x: number, y: number } | null;
    onTypeChange?: (type: string) => void;
}

export default function CreateEventModal({ onClose, onSubmit, location, screenCoords, onTypeChange }: CreateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        time: "",
        type: "chill",
        isPrivate: false,
        maxAttendees: ""
    });
    const [address, setAddress] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial positioning state to prevent jump
    // Start with a safe default (Center) so if logic fails it's visible
    const [position, setPosition] = useState({
        top: typeof window !== 'undefined' ? window.innerHeight * 0.15 : 100,
        left: typeof window !== 'undefined' ? (window.innerWidth / 2) - 160 : 0
    });

    useEffect(() => {
        if (screenCoords && containerRef.current) {
            // Calculate position to center bubble above or near the click
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;

            // Position logic: Always try to be above the cursor first
            // Add a larger buffer (40px)
            let top = screenCoords.y - height - 40;
            let left = screenCoords.x - (width / 2);

            // If it goes off top (top < 80 for valid header space), flip to below
            if (top < 80) {
                top = screenCoords.y + 40;
            }

            // Ensure it never touches the very bottom
            if (top + height > window.innerHeight - 20) {
                top = window.innerHeight - height - 20;
            }

            // Horizontal Clamp
            if (left < 20) left = 20;
            if (left + width > window.innerWidth - 20) left = window.innerWidth - width - 20;

            setPosition({ top, left });
        } else if (!screenCoords) {
            // Fallback: Force Top-Center (High up, not middle)
            // Using logic to place it consistently in the upper quadrant
            setPosition({
                top: window.innerHeight * 0.15, // 15% from top
                left: (window.innerWidth / 2) - 160 // Center 320px width
            });
        }
    }, [screenCoords]);

    // Reverse Geocode (Keeping existing logic...)
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
        <div
            className="fixed inset-0 z-[2000] pointer-events-none"
        >
            {/* Bubble Container */}
            <div
                ref={containerRef}
                style={{
                    top: position.top,
                    left: position.left,
                    opacity: screenCoords ? 1 : 0 // Hide until positioned
                }}
                className="absolute pointer-events-auto transition-all duration-300 ease-out"
            >
                <div className="glass-panel w-80 p-4 relative animate-scale-in rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#0a0a0c]/95 overflow-hidden">

                    {/* Bubble Arrow (Pseudo-element simulation via manual div if needed, but keeping it simple first) */}

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X size={16} />
                    </button>

                    <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="text-[var(--ghost-accent)]" size={16} />
                        <h2 className="text-base font-bold text-white tracking-tight">New Drop</h2>
                    </div>

                    <div className="mb-4">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1 block flex items-center gap-1">
                            <MapPin size={10} />
                            {address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {/* Title Input */}
                        <input
                            type="text"
                            required
                            placeholder="Name your event..."
                            autoFocus
                            className="w-full bg-white/5 border-b border-white/10 px-2 py-2 text-sm font-bold placeholder:text-white/30 focus:outline-none focus:border-[var(--ghost-primary)] focus:bg-transparent transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />

                        {/* Event Types - Bubble Style */}
                        <div className="flex flex-wrap gap-1.5 justify-center my-1">
                            {eventTypes.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: type.id });
                                        onTypeChange?.(type.id);
                                    }}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[10px] font-bold transition-all ${formData.type === type.id
                                        ? "bg-[var(--ghost-primary)] border-white text-white shadow-[0_0_10px_var(--ghost-primary-glow)] scale-105"
                                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                                        }`}
                                >
                                    <span>{type.icon}</span>
                                    <span>{type.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <textarea
                            required
                            placeholder="What's the vibe?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--ghost-primary)] resize-none h-14 text-xs transition-all placeholder:text-white/30"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />

                        {/* Compact Settings */}
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                required
                                min={`${new Date().toISOString().slice(0, 10)}T00:00`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[var(--ghost-primary)] [color-scheme:dark]"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                                className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${formData.isPrivate
                                    ? "bg-red-500/20 border-red-500/50 text-red-200"
                                    : "bg-white/5 border-white/10 text-white/60"
                                    }`}
                            >
                                <Lock size={10} />
                                {formData.isPrivate ? "Private" : "Public"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--ghost-primary)] text-white font-bold py-2.5 rounded-xl hover:bg-purple-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-1 text-xs"
                        >
                            Create Pin
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
