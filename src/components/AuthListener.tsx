
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";

export default function AuthListener() {
    // Select specific actions to avoid re-rendering on every store change
    const setUser = useStore(state => state.setUser);
    const login = useStore(state => state.login);
    // Use cleanSession for internal state updates to avoid loops
    const cleanSession = useStore(state => state.cleanSession);
    const initializeRealtime = useStore(state => state.initializeRealtime);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (session?.user) {
                    // 1. Try to fetch existing profile
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profile) {
                        // Profile exists, load it
                        login();
                        setUser({
                            id: profile.id,
                            email: profile.email || session.user.email!,
                            name: profile.name || 'Ghost',
                            username: profile.username || 'ghost',
                            bio: profile.bio || '',
                            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.id}`,
                            location: profile.location ? { lat: profile.location.lat, lng: profile.location.lng } : { lat: 18.2208, lng: -66.5901 },
                            status: profile.status as any || 'online',
                            lastActive: new Date().toISOString(),
                            interests: [],
                            city: profile.city || '',
                            relationshipTier: 'normal'
                        });
                        // initializeRealtime();
                    } else {
                        // 2. Profile doesn't exist, create it
                        const newProfile = {
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.email?.split('@')[0] || 'Ghost',
                            username: session.user.email?.split('@')[0] || `ghost_${session.user.id.slice(0, 4)}`,
                            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.id}`,
                            status: 'online',
                        };

                        const { error: insertError } = await supabase
                            .from('users')
                            .insert([newProfile]);

                        if (!insertError) {
                            login();
                            setUser({
                                id: newProfile.id,
                                email: newProfile.email!,
                                name: newProfile.name,
                                username: newProfile.username,
                                bio: '',
                                avatar: newProfile.avatar_url,
                                location: { lat: 18.2208, lng: -66.5901 },
                                status: 'online',
                                lastActive: new Date().toISOString(),
                                interests: [],
                                relationshipTier: 'normal'
                            });
                            // initializeRealtime();
                        } else {
                            console.error("Error creating profile:", insertError);
                        }
                    }

                    if (pathname === '/login' || pathname === '/signup') {
                        router.push('/map');
                    }
                } else {
                    cleanSession();
                    if (pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
                        router.push('/');
                    }
                }
            } catch (error: any) {
                // Ignore abort errors from rapid auth state changes
                if (error.message?.includes('Aborted') || error.name === 'AbortError') return;
                console.error("Auth Listener Error:", error);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [pathname, setUser, login, cleanSession, router, initializeRealtime]);

    return null;
}
