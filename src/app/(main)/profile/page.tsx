"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Settings, Shield, Ghost, LogOut, MapPin, Edit2, Check, X, UserPlus, Heart, Zap, Camera, BookOpen, BadgeCheck } from "lucide-react";
import SettingsModal from "./SettingsModal";
import PrivacyModal from "./PrivacyModal";
import CommunityGuidelinesModal from "./CommunityGuidelinesModal";
import { User } from "@/lib/types";

export default function ProfilePage() {
    const { currentUser, toggleVisibility, setUser, updateProfile, logout, requests, connections, acceptRequest, nearbyUsers } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(false);

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
            updateProfile(formData);
        }
        setIsEditing(false);
        setFormData(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string' && formData) {
                    setFormData({ ...formData, avatar: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
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
                            {/* Live Preview */}
                            <div className="relative mb-2">
                                {formData.avatar.startsWith('http') || formData.avatar.startsWith('data:') ? (
                                    <img
                                        src={formData.avatar}
                                        alt="Preview"
                                        style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }}
                                        className="border-4 border-[var(--ghost-surface)] shadow-xl"
                                    />
                                ) : (
                                    <div
                                        style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: formData.avatar }}
                                        className="flex items-center justify-center text-3xl font-bold text-white border-4 border-[var(--ghost-surface)] shadow-xl"
                                    >
                                        {formData.name?.[0] || '?'}
                                    </div>
                                )}
                            </div>

                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Avatar Style</label>

                            {/* Upload Button */}
                            <div className="mb-2 w-full flex justify-center">
                                <label className="cursor-pointer bg-[var(--ghost-surface)] hover:bg-[var(--ghost-surface-hover)] border border-[var(--ghost-border)] rounded-lg px-4 py-2 flex items-center gap-2 transition-colors group">
                                    <Camera size={18} className="text-[var(--ghost-primary)] group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold">Upload Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

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
                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Username</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-2 text-center text-white focus:border-[var(--ghost-primary)] outline-none font-mono text-sm"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="@username"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <label className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-wider">Based In</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--ghost-surface)] border border-[var(--ghost-border)] rounded-lg p-2 text-center text-white focus:border-[var(--ghost-primary)] outline-none text-sm"
                                value={formData.city || ''}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="City, Country (e.g. San Juan, PR)"
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
                            {currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:') ? (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }}
                                    className="border-4 border-[var(--ghost-surface)] shadow-xl mb-4"
                                />
                            ) : (
                                <div
                                    style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: currentUser.avatar }}
                                    className="flex items-center justify-center text-3xl font-bold text-white mb-4 border-4 border-[var(--ghost-surface)] shadow-xl"
                                >
                                    {currentUser.name[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                            {currentUser.isVerified && (
                                <BadgeCheck size={24} className="text-blue-400 fill-blue-400/10" />
                            )}
                        </div>
                        {currentUser.city && (
                            <div className="flex items-center gap-1.5 text-[var(--ghost-text-muted)] text-sm mb-2 px-3 py-1 bg-[var(--ghost-surface)] rounded-full">
                                <MapPin size={12} className="text-[var(--ghost-primary)]" />
                                <span>{currentUser.city}</span>
                            </div>
                        )}
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
                {/* Visibility Card Removed by User Request */}

                {/* Friend Requests */}
                {requests.incoming.length > 0 && (
                    <div className="glass-panel p-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-[var(--ghost-surface)]">
                                <UserPlus size={24} className="text-[var(--ghost-secondary)]" />
                            </div>
                            <div>
                                <h3 className="font-bold">Spirit Requests</h3>
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
                        onClick={() => setShowGuidelines(true)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[var(--ghost-surface-hover)] rounded-lg transition-colors text-left"
                    >
                        <BookOpen size={20} className="text-[var(--ghost-text)]" />
                        <span>Community Guidelines</span>
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
            {showPrivacy && <PrivacyModal
                onClose={() => setShowPrivacy(false)}
                onOpenGuidelines={() => {
                    setShowPrivacy(false);
                    setShowGuidelines(true);
                }}
            />}
            {showGuidelines && <CommunityGuidelinesModal onClose={() => setShowGuidelines(false)} />}
        </div>
    );
}
