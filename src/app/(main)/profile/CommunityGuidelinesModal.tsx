import { X, Heart, Shield, Ghost, MessageSquare } from "lucide-react";
import { useStore } from "@/lib/store";

interface CommunityGuidelinesModalProps {
    onClose: () => void;
}

export default function CommunityGuidelinesModal({ onClose }: CommunityGuidelinesModalProps) {
    const { currentUser, setUser } = useStore();

    const handleAgree = () => {
        if (currentUser) {
            setUser({ ...currentUser, isVerified: true });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
                    <div className="flex items-center gap-2 text-white">
                        <Ghost size={20} className="text-[var(--ghost-primary)]" />
                        <h2 className="font-bold text-lg">Community Guidelines</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                        Welcome to Ghostly. To keep our realm safe and ethereal for everyone, please agree to our core values.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="p-2 h-fit bg-[var(--ghost-surface)] rounded-xl text-pink-400 shrink-0">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base mb-1">Respect the Vibe</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Be kind to fellow spirits. Harassment, hate speech, and bullying are strictly overly-corporeal behavior and will vanish you from the platform.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="p-2 h-fit bg-[var(--ghost-surface)] rounded-xl text-yellow-400 shrink-0">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base mb-1">Keep it Safe</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Do not share private information (yours or others'). Keep specific location details vague if you are unsure. Report suspicious hauntings immediately.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="p-2 h-fit bg-[var(--ghost-surface)] rounded-xl text-blue-400 shrink-0">
                                <Ghost size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base mb-1">No Bad Hauntings</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Trolling, spamming events, or creating fake landmarks ruins the map for everyone. Be a friendly ghost, not a poltergeist.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="p-2 h-fit bg-[var(--ghost-surface)] rounded-xl text-green-400 shrink-0">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base mb-1"> Authentic Connections</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Use your real (or main online) identity. Catfishing or impersonating other spirits is not allowed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                        <p className="text-xs text-gray-500">
                            Violating these terms may result in your account being suspended or permanently exorcised.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                    <button
                        onClick={handleAgree}
                        className="w-full py-3 bg-[var(--ghost-primary)] hover:opacity-90 text-black font-bold rounded-xl transition-all active:scale-95"
                    >
                        I Agree & Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
