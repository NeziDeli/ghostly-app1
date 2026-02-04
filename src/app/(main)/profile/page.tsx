"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Settings, Shield, Ghost, LogOut, MapPin, Edit2, Check, X, UserPlus, Heart, Zap } from "lucide-react";
import SettingsModal from "./SettingsModal";
import PrivacyModal from "./PrivacyModal";
import { User } from "@/lib/types";

export default function ProfilePage() {
    const { currentUser, toggleVisibility, setUser, logout, requests, connections, acceptRequest, nearbyUsers } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    if (!currentUser) return null;

    const handleStartEdit = () => {
        setFormData({ ...currentUser });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(null);
    };

    const handleSave = () => {
        if (formData) {
            setUser(formData);
        }
        setIsEditing(false);
        setFormData(null);
    };

    return (
        <div className="container min-h-screen pt-8 pb-24">
            <div className="flex flex-col items-center mb-8 relative w-full">
                {isEditing ? (
                    <div className="absolute right-0 top-0 flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="p-2 text-red-400 hover:bg-[var(--ghost-surface)] rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <button
                            onClick={handleSave}
                            className="p-2 text-[var(--ghost-primary)] hover:bg-[var(--ghost-surface)] rounded-full transition-colors"
                        >
                            <Check size={24} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleStartEdit}
                        className="absolute right-0 top-0 p-2 text-[var(--ghost-primary)] hover:bg-[var(--ghost-surface)] rounded-full transition-colors"
                    >
                        <Edit2 size={24} />
                    </button>
                )}

                {isEditing && formData ? (
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col items-center gap-2 w-full">
                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Avatar Style</label>

                            {/* Color Picker */}
                            <div className="flex gap-2 flex-wrap justify-center mb-2">
                                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'].map((color) => (
                                    <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.avatar === color ? 'border-white scale-110 ring-2 ring-[var(--ghost-primary)]' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({ ...formData, avatar: color })}
                                    />
                                ))}
                            </div>

                            {/* Custom URL Toggle */}
                            <details className="w-full">
                                <summary className="text-xs text-[var(--ghost-primary)] cursor-pointer text-center list-none hover:underline mb-2">
                                    Use Custom Image URL
                                </summary>
                                <input
                                    type="text"
                                    className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-2 text-sm text-white focus:border-[var(--ghost-primary)] outline-none animate-fade-in"
                                    value={formData.avatar.startsWith('#') ? '' : formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </details>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-2 text-center font-bold text-white focus:border-[var(--ghost-primary)] outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Bio</label>
                            <textarea
                                className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-2 text-center text-sm text-[var(--ghost-text-muted)] focus:border-[var(--ghost-primary)] outline-none resize-none"
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative group">
                            {currentUser.avatar.startsWith('http') ? (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-[var(--ghost-surface)] shadow-xl mb-4"
                                />
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 border-4 border-[var(--ghost-surface)] shadow-xl"
                                    style={{ backgroundColor: currentUser.avatar }}
                                >
                                    {currentUser.name[0]}
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                        <p className="text-[var(--ghost-text-muted)] text-sm mb-2">{currentUser.username}</p>
                        {currentUser.bio && (
                            <p className="text-center text-sm max-w-xs text-gray-300 leading-relaxed italic">
                                "{currentUser.bio}"
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {/* Visibility Card */}
                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${currentUser.status === 'online' ? 'bg-[var(--status-online)] text-black' : 'bg-[var(--ghost-text-muted)]'}`}>
                                <Ghost size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">Ghost Mode</h3>
                                <p className="text-sm text-[var(--ghost-text-muted)]">
                                    {currentUser.status === 'online' ? 'You are visible' : 'You are hidden'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={toggleVisibility}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${currentUser.status === 'online' ? 'bg-[var(--ghost-primary)]' : 'bg-[var(--ghost-surface)]'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 ${currentUser.status === 'online' ? 'left-7' : 'left-1'
                                }`} />
                        </button>
                    </div>

                    <p className="text-xs text-[var(--ghost-text-muted)] mt-2">
                        When hidden, you assume a ghostly form. You can see others, but they cannot see you unless you interact.
                    </p>
                    <p className="text-xs text-[var(--ghost-text-muted)] mt-2">
                        When hidden, you assume a ghostly form. You can see others, but they cannot see you unless you interact.
                    </p>
                </div>

                {/* Friend Requests */}
                {requests.incoming.length > 0 && (
                    <div className="glass-panel p-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-[var(--ghost-surface)]">
                                <UserPlus size={24} className="text-[var(--ghost-secondary)]" />
                            </div>
                            <div>
                                <h3 className="font-bold">Friend Requests</h3>
                                <p className="text-sm text-[var(--ghost-text-muted)]">
                                    Spirits seeking connection
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {requests.incoming.map(reqId => {
                                const reqUser = nearbyUsers.find(u => u.id === reqId);
                                if (!reqUser) return null;
                                return (
                                    <div key={reqId} className="flex items-center justify-between bg-[var(--ghost-bg)] p-3 rounded-xl border border-[var(--ghost-border)]">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                                style={{ backgroundColor: reqUser.avatar }}
                                            >
                                                {reqUser.name[0]}
                                            </div>
                                            <span className="font-bold text-sm">{reqUser.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => acceptRequest(reqId)}
                                                className="p-2 bg-[var(--ghost-primary)] text-black rounded-lg hover:opacity-90 transition-opacity"
                                                title="Accept"
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Connections (Soulbind Management) */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[var(--ghost-surface)]">
                            <Heart size={24} className="text-pink-400" />
                        </div>
                        <div>
                            <h3 className="font-bold">Your Connections</h3>
                            <p className="text-sm text-[var(--ghost-text-muted)]">
                                Manage your spiritual bonds
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {Object.entries(connections).length === 0 ? (
                            <p className="text-center text-sm text-[var(--ghost-text-muted)] py-4">No connections yet.</p>
                        ) : (
                            Object.entries(connections).map(([userId, tier]) => {
                                const friend = nearbyUsers.find(u => u.id === userId);
                                if (!friend) return null;
                                const isSoulbound = tier === 'soulbound';

                                return (
                                    <div key={userId} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSoulbound ? 'bg-yellow-400/5 border-yellow-400/30' : 'bg-[var(--ghost-bg)] border-[var(--ghost-border)]'}`}>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                                style={{ backgroundColor: friend.avatar }}
                                            >
                                                {friend.name[0]}
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm block">{friend.name}</span>
                                                <span className={`text-[10px] uppercase tracking-wider font-bold ${isSoulbound ? 'text-yellow-400' : 'text-[var(--ghost-text-muted)]'}`}>
                                                    {isSoulbound ? 'Soulbound' : 'Friend'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Toggle Tier (In a real app, maybe a prompt)
                                                // Accessing store directly? using acceptRequest to update tier or need a new action?
                                                // acceptRequest overwrites, so we can use it to 'upgrade'
                                                acceptRequest(userId, isSoulbound ? 'normal' : 'soulbound');
                                            }}
                                            className={`p-2 rounded-lg transition-all ${isSoulbound ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 'bg-[var(--ghost-surface)] text-[var(--ghost-text-muted)] hover:text-white'}`}
                                            title={isSoulbound ? "Unbind" : "Soulbind"}
                                        >
                                            <Zap size={16} fill={isSoulbound ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[var(--ghost-surface)]">
                            <MapPin size={24} className="text-[var(--ghost-primary)]" />
                        </div>
                        <div>
                            <h3 className="font-bold">Default Location</h3>
                            <p className="text-sm text-[var(--ghost-text-muted)]">
                                Choose where your map opens
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <select
                            className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-3 text-white appearance-none cursor-pointer hover:border-[var(--ghost-primary)] transition-colors"
                            value={`${currentUser.location.lat},${currentUser.location.lng}`} // Simple value binding
                            onChange={(e) => {
                                const [lat, lng] = e.target.value.split(',').map(Number);
                                setUser({
                                    ...currentUser,
                                    location: { lat, lng }
                                });
                            }}
                        >
                            <option value="40.7128,-74.0060">New York, USA</option>
                            <option value="34.0522,-118.2437">Los Angeles, USA</option>
                            <option value="18.4655,-66.1057">San Juan, Puerto Rico</option>
                            <option value="51.5074,-0.1278">London, UK</option>
                            <option value="48.8566,2.3522">Paris, France</option>
                            <option value="52.5200,13.4050">Berlin, Germany</option>
                            <option value="35.6762,139.6503">Tokyo, Japan</option>
                            <option value="19.0760,72.8777">Mumbai, India</option>
                            <option value="1.3521,103.8198">Singapore</option>
                            <option value="-33.8688,151.2093">Sydney, Australia</option>
                            <option value="-22.9068,-43.1729">Rio de Janeiro, Brazil</option>
                            <option value="30.0444,31.2357">Cairo, Egypt</option>
                            <option value="25.2048,55.2708">Dubai, UAE</option>
                        </select>
                        <p className="text-xs text-[var(--ghost-text-muted)] text-center">
                            Select a major city to center your experience.
                        </p>
                    </div>
                </div>

                {/* Settings */}
                <div className="glass-panel p-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors text-left"
                    >
                        <Settings size={20} className="text-[var(--ghost-text)]" />
                        <span>Account Settings</span>
                    </button>

                    <button
                        onClick={() => setShowPrivacy(true)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors text-left"
                    >
                        <Shield size={20} className="text-[var(--ghost-text)]" />
                        <span>Privacy & Safety</span>
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors text-left"
                    >
                        <LogOut size={20} className="text-red-400" />
                        <span className="text-red-400">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
        </div>
    );
}
