"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const { login } = useStore();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            // For mock purposes, signup is same as login
            login();
            router.push("/map");
        }, 1200);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative overflow-hidden bg-[var(--ghost-bg)]">
            {/* Nav Back */}
            <Link href="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-[var(--ghost-surface)] transition-colors z-[50] group">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ghost-text-muted)] group-hover:text-[var(--ghost-text)]">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </Link>

            {/* Background Decor - Softer */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--ghost-accent)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center animate-fade-in w-full max-w-sm">
                <div className="mb-6 relative group cursor-default">
                    <div className="absolute inset-0 bg-[var(--ghost-primary)] blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity" />
                    <Ghost size={48} className="text-[var(--ghost-text)] relative z-10 drop-shadow-lg" />
                </div>

                <h1 className="text-2xl font-bold mb-2 tracking-tight">Create Account</h1>
                <p className="text-sm text-[var(--ghost-text-muted)] mb-8 max-w-[250px]">
                    Join the realm to find others near you.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSignup} className="w-full flex flex-col gap-3 mb-6">
                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--ghost-surface)] border border-transparent focus:border-[var(--ghost-primary)] placeholder:text-[var(--ghost-text-muted)]/50 rounded-2xl px-5 py-3.5 text-sm transition-all focus:bg-[var(--ghost-surface-hover)] outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--ghost-surface)] border border-transparent focus:border-[var(--ghost-primary)] placeholder:text-[var(--ghost-text-muted)]/50 rounded-2xl px-5 py-3.5 text-sm transition-all focus:bg-[var(--ghost-surface-hover)] outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[var(--ghost-primary)] text-white font-bold py-3.5 px-4 rounded-2xl hover:bg-[#9b8eff] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--ghost-primary-glow)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none mt-2"
                    >
                        {isLoading ? "creating soul..." : "Sign Up with Email"}
                    </button>
                    <p className="text-[10px] text-[var(--ghost-text-muted)] mt-1 opacity-60">
                        * Mock Signup: No email verification needed.
                    </p>
                </form>

                <div className="text-xs text-[var(--ghost-text-muted)] uppercase tracking-widest mb-6 relative w-full flex items-center justify-center">
                    <span className="bg-[var(--ghost-bg)] px-2 z-10">Or continue with</span>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--ghost-border)] -z-0 opacity-50"></div>
                </div>

                <button
                    onClick={() => handleSignup()}
                    className="w-full bg-white text-black font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md border border-gray-100"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                <div className="mt-8 text-sm text-[var(--ghost-text-muted)]">
                    Already have a soul? <Link href="/login" className="text-[var(--ghost-accent)] hover:underline font-medium ml-1">Log in</Link>
                </div>
            </div>
        </div>
    );
}
