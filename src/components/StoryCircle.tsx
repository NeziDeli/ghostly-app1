"use client";

import { User } from "@/lib/types";

interface StoryCircleProps {
    user: User;
    hasUnseen: boolean;
    onClick: () => void;
}

export default function StoryCircle({ user, hasUnseen, onClick }: StoryCircleProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1 min-w-[72px]"
        >
            <div className={`p-[2px] rounded-full ${hasUnseen ? 'bg-gradient-to-tr from-[var(--ghost-accent)] to-[var(--ghost-primary)]' : 'bg-[var(--ghost-border)]'}`}>
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-[var(--ghost-bg)]"
                    style={{ backgroundColor: user.avatar }}
                >
                    {user.name[0]}
                </div>
            </div>
            <span className="text-xs text-[var(--ghost-text-muted)] truncate max-w-full">
                {user.name.split(' ')[0]}
            </span>
        </button>
    );
}
