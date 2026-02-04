"use client";

import { useEffect, useState } from "react";
import { Story, User } from "@/lib/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface StoryViewerProps {
    stories: Story[];
    user: User;
    initialStoryIndex?: number;
    onClose: () => void;
    onComplete: () => void;
}

export default function StoryViewer({ stories, user, initialStoryIndex = 0, onClose, onComplete }: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const DURATION = 5000; // 5 seconds per story
    const UPDATE_INTERVAL = 50;

    const currentStory = stories[currentIndex];

    useEffect(() => {
        // Reset progress when changing stories
        setProgress(0);
    }, [currentIndex]);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex(prevIndex => prevIndex + 1);
                        return 0;
                    } else {
                        clearInterval(timer);
                        onComplete();
                        return 100;
                    }
                }
                return prev + (100 / (DURATION / UPDATE_INTERVAL));
            });
        }, UPDATE_INTERVAL);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused, stories.length, onComplete]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!currentStory) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center animate-fade-in">
            {/* Desktop Container (Mobile wraps full screen) */}
            <div className="relative w-full h-full md:max-w-[400px] md:h-[90vh] md:rounded-2xl overflow-hidden bg-gray-900">

                {/* Content */}
                <div
                    className="absolute inset-0 flex items-center justify-center p-8 text-center"
                    style={{ backgroundColor: currentStory.imageUrl ? 'black' : (currentStory.color || '#8a7cff') }}
                    onPointerDown={() => setIsPaused(true)}
                    onPointerUp={() => setIsPaused(false)}
                >
                    {currentStory.imageUrl ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={currentStory.imageUrl}
                                alt="Story"
                                fill
                                className="object-contain"
                            />
                            {currentStory.text && (
                                <div className="absolute bottom-12 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm text-white rounded-lg">
                                    {currentStory.text}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-2xl font-bold text-white break-words animate-fade-in-up">
                            {currentStory.text}
                        </div>
                    )}
                </div>

                {/* Overlays */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent pt-safe">
                    {/* Progress Bars */}
                    <div className="flex gap-1 mb-3">
                        {stories.map((story, idx) => (
                            <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-linear ease-linear"
                                    style={{
                                        width: idx < currentIndex ? '100%' :
                                            idx === currentIndex ? `${progress}%` : '0%'
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-600 border border-white/20 flex items-center justify-center overflow-hidden">
                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                            </div>
                            <div className="flex flex-col text-white">
                                <span className="text-sm font-bold shadow-black drop-shadow-md">{user.name}</span>
                                <span className="text-xs opacity-80 shadow-black drop-shadow-md">
                                    {new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Touch Zones */}
                <div className="absolute inset-0 flex">
                    <div className="w-1/3 h-full z-10" onClick={handlePrev} />
                    <div className="w-2/3 h-full z-10" onClick={handleNext} />
                </div>
            </div>
        </div>
    );
}
