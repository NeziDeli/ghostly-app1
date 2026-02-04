"use client";

import Link from "next/link";
import { Ghost } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { isAuthenticated } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/feed");
        }
    }, [isAuthenticated, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--ghost-primary)] opacity-20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center animate-fade-in">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-[var(--ghost-accent)] blur-xl opacity-20 rounded-full animate-pulse" />
                    <Ghost size={80} className="text-[var(--ghost-text)] relative z-10" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-[var(--ghost-text-muted)]">
                    GHOSTLY
                </h1>

                <p className="text-xl text-[var(--ghost-text-muted)] max-w-xs mx-auto mb-12">
                    Connect with nearby souls without the pressure.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    {isAuthenticated ? (
                        // If authenticated, redirecting happens automatically in effect, 
                        // but showing Enter button as fallback is fine.
                        <Link href="/map" className="btn btn-primary w-full">
                            Enter Realm
                        </Link>
                    ) : (
                        <>
                            <Link href="/signup" className="btn btn-primary w-full">
                                Sign Up (Start Here)
                            </Link>
                            <Link href="/login" className="btn btn-ghost w-full">
                                I already have an account
                            </Link>
                        </>
                    )}

                    <div className="text-sm text-[var(--ghost-text-muted)] mt-8">
                        <p>Privacy First • Location Based • No Ads</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
