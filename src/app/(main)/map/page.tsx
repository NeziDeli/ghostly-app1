"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Users, MessageSquare, User, Bell } from "lucide-react";

const GlobeMap = dynamic(
    () => import("@/components/GlobeMap"),
    {
        loading: () => <div className="flex items-center justify-center h-screen bg-[var(--ghost-bg)]">Loading Ghostly Globe...</div>,
        ssr: false
    }
);

export default function MapPage() {

    return (
        <div className="h-screen w-full relative isolate">
            {/* Navigation HUD */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-6 md:right-6 md:left-auto z-[400] flex flex-row md:flex-col gap-3 w-auto justify-center">
                <Link href="/feed" className="flex items-center gap-2 md:gap-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-xl px-5 py-3 rounded-full md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group shadow-lg">
                    <div className="p-1.5 md:p-2 bg-[var(--ghost-primary)] rounded-full text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                        <Users size={18} className="md:w-5 md:h-5" />
                    </div>
                    <span className="font-bold text-white text-sm md:text-base hidden sm:block md:block">Nearby</span>
                </Link>

                <Link href="/messages" className="flex items-center gap-2 md:gap-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-xl px-5 py-3 rounded-full md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group shadow-lg">
                    <div className="p-1.5 md:p-2 bg-gray-800 rounded-full text-white group-hover:bg-gray-700 transition-colors">
                        <MessageSquare size={18} className="md:w-5 md:h-5" />
                    </div>
                    <span className="font-bold text-white text-sm md:text-base hidden sm:block md:block">Chats</span>
                </Link>

                <Link href="/notifications" className="flex items-center gap-2 md:gap-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-xl px-5 py-3 rounded-full md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group shadow-lg">
                    <div className="p-1.5 md:p-2 bg-gray-800 rounded-full text-white group-hover:bg-gray-700 transition-colors">
                        <Bell size={18} className="md:w-5 md:h-5" />
                    </div>
                </Link>

                <Link href="/profile" className="flex items-center gap-2 md:gap-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-xl px-5 py-3 rounded-full md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group shadow-lg">
                    <div className="p-1.5 md:p-2 bg-gray-800 rounded-full text-white group-hover:bg-gray-700 transition-colors">
                        <User size={18} className="md:w-5 md:h-5" />
                    </div>
                    <span className="font-bold text-white text-sm md:text-base hidden sm:block md:block">Profile</span>
                </Link>
            </div>

            <div className="absolute inset-0 z-0">
                <GlobeMap />
            </div>
        </div>
    );
}
