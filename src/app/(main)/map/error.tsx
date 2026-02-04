"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0c] text-white p-4">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Map Crash Detected</h2>
            <p className="text-white/60 mb-6 text-center max-w-md">
                The 3D engine encountered a critical error. This often happens during development when reloading 3D contexts.
            </p>
            <div className="bg-white/5 p-4 rounded-lg mb-6 max-w-full overflow-auto font-mono text-xs text-red-200">
                {error.message || "Unknown WebGL Error"}
            </div>
            <button
                onClick={() => {
                    // Force a hard reload to clear WebGL contexts
                    window.location.href = window.location.href;
                }}
                className="px-6 py-3 bg-[var(--ghost-primary)] hover:bg-white text-white hover:text-black font-bold rounded-full transition-all shadow-lg"
            >
                Hard Reload Map
            </button>
        </div>
    );
}
