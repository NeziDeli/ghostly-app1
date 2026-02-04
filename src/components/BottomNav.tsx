"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Users, MessageSquare, User } from "lucide-react";
import { useStore } from "@/lib/store";

export default function BottomNav() {
    const pathname = usePathname();
    const { currentUser, messages } = useStore();

    const navItems = [
        { href: "/map", label: "Map", icon: Map },
        { href: "/feed", label: "Nearby", icon: Users },
        { href: "/messages", label: "Chats", icon: MessageSquare },
        { href: "/profile", label: "You", icon: User },
    ];

    // Don't show nav on landing page, auth pages, or map page (custom floating nav)
    if (pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/map") return null;

    const isMap = pathname === "/map";

    // Calculate unread count
    const unreadCount = Object.values(messages).flat().filter(
        msg => !msg.read && msg.senderId !== currentUser?.id
    ).length;

    return (
        <>
            {/* Floating Exit Button for non-map pages */}
            {!isMap && (
                <div className="fixed bottom-24 right-4 z-[10000]">
                    <Link
                        href="/map"
                        className="bg-red-500/90 text-white p-4 rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-red-400"
                    >
                        <span className="sr-only">Exit to Map</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </Link>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 z-[9999] glass-panel rounded-none border-x-0 border-b-0 pb-safe">
                <div className="mx-auto max-w-md flex justify-around items-center p-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        const isChat = item.href === "/messages";

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive
                                    ? "text-[var(--ghost-secondary)] scale-110 bg-[var(--ghost-surface-hover)] shadow-[0_0_15px_var(--ghost-primary-glow)] border border-[var(--ghost-primary)]/30 float-hover"
                                    : "text-[var(--ghost-text-muted)] hover:text-[var(--ghost-text)] hover-scale"
                                    }`}
                            >
                                <div className="relative">
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {isChat && unreadCount > 0 && !pathname.startsWith('/messages') && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[var(--ghost-surface)]">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium mt-1 opacity-80">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
