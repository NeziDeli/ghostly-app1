import { X, Shield, Lock, Eye, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";

interface PrivacyModalProps {
    onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
    const { currentUser, toggleVisibility } = useStore();

    if (!currentUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2 text-white">
                        <Shield size={20} className="text-[var(--ghost-primary)]" />
                        <h2 className="font-bold text-lg">Privacy & Safety</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-0">
                    {/* Ghost Mode Toggle */}
                    <div className="p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--ghost-surface)] rounded-lg text-white">
                                    <Eye size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Ghost Mode</h3>
                                    <p className="text-xs text-gray-400">Hide your location from others</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleVisibility}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${currentUser.status === 'online' ? 'bg-[var(--ghost-primary)]' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 ${currentUser.status === 'online' ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            When enabled, you remain visible on the map. Turn off to disappear completely while still seeing others.
                        </p>
                    </div>

                    {/* Blocked Users */}
                    <button className="w-full p-6 border-b border-white/5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--ghost-surface)] rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[var(--ghost-primary)] transition-colors">Blocked Users</h3>
                                <p className="text-xs text-gray-400">Manage accounts you have blocked</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-white">0</span>
                    </button>

                    {/* Safety Resources */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[var(--ghost-surface)] rounded-lg text-yellow-500">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Safety Resources</h3>
                                <p className="text-xs text-gray-400">Helpful tools and contacts</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <a href="#" className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors">
                                🆘 Emergency Services
                            </a>
                            <a href="#" className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors">
                                📖 Community Guidelines
                            </a>
                            <a href="#" className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors">
                                🛡️ How to report an incident
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
