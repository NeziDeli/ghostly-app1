"use client";

import { useState } from "react";
import { X, Type, Image as ImageIcon, Send } from "lucide-react";
import { useStore } from "@/lib/store";

interface CreateStoryModalProps {
    onClose: () => void;
}

const COLORS = ['#8a7cff', '#00e0ff', '#ff6b6b', '#feca57', '#54a0ff', '#5f27cd', '#1e1e22'];

export default function CreateStoryModal({ onClose }: CreateStoryModalProps) {
    const { addStory } = useStore();
    const [text, setText] = useState("");
    const [colorIndex, setColorIndex] = useState(0);
    const [mode, setMode] = useState<'text' | 'image'>('text');

    const handlePost = () => {
        if (!text.trim()) return;

        addStory({
            text,
            color: COLORS[colorIndex],
            // For now, no actual image, we stick to text-based stories for MVP mostly
            // unless mode is image we could mock a url, but let's stick to text for polish.
            type: 'text'
        });
        onClose();
    };

    const cycleColor = () => {
        setColorIndex((prev) => (prev + 1) % COLORS.length);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex items-center justify-between z-20">
                <button onClick={onClose} className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white">
                    <X size={24} />
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={cycleColor}
                        className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:scale-110 transition-transform"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: COLORS[(colorIndex + 1) % COLORS.length] }} />
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div
                className="flex-1 flex items-center justify-center p-8 transition-colors duration-500"
                style={{ backgroundColor: COLORS[colorIndex] }}
            >
                <textarea
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tap to type..."
                    className="w-full h-full bg-transparent text-white text-4xl font-bold text-center placeholder:text-white/50 focus:outline-none resize-none flex items-center justify-center pt-[40vh]"
                />
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe flex items-center justify-end z-20 bg-gradient-to-t from-black/50 to-transparent">
                <button
                    onClick={handlePost}
                    disabled={!text.trim()}
                    className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                    Send <Send size={18} />
                </button>
            </div>
        </div>
    );
}
