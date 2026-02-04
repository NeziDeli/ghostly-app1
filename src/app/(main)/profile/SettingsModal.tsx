"use client";

import { X, Bell, Moon, Volume2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const { currentUser } = useStore();
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-[#121214] border border-[var(--ghost-border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--ghost-border)] bg-[var(--ghost-surface)]">
                    <h2 className="text-lg font-bold">Account Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Account Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase text-[var(--ghost-text-muted)] font-bold tracking-wider">Account</h3>
                        <div className="glass-panel p-4 flex flex-col gap-3">
                            <div>
                                <label className="text-xs text-[var(--ghost-text-muted)]">Email</label>
                                <div className="text-white font-medium">user@example.com</div>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--ghost-text-muted)]">Username</label>
                                <div className="text-white font-medium">@{currentUser?.username}</div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase text-[var(--ghost-text-muted)] font-bold tracking-wider">Preferences</h3>
                        <div className="glass-panel p-2">
                            <div className="flex items-center justify-between p-3 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Bell size={20} className="text-[var(--ghost-text)]" />
                                    <span>Notifications</span>
                                </div>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${notifications ? 'bg-[var(--ghost-primary)]' : 'bg-[var(--ghost-surface)]'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Volume2 size={20} className="text-[var(--ghost-text)]" />
                                    <span>Sound Effects</span>
                                </div>
                                <button
                                    onClick={() => setSound(!sound)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${sound ? 'bg-[var(--ghost-primary)]' : 'bg-[var(--ghost-surface)]'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${sound ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-[var(--ghost-border)]">
                        <button className="w-full flex items-center justify-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
