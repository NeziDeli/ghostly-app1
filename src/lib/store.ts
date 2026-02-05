import { create } from 'zustand';
import { AppState, User, Message, Event, Story } from './types';
import { MOCK_USERS, MOCK_EVENTS, MOCK_STORIES, CURRENT_USER } from './mockData';
import { LANDMARKS } from './places';

interface Store extends AppState {
    setUser: (user: User) => void;
    updateProfile: (user: User) => Promise<void>;
    joinEvent: (eventId: string) => void;
    leaveEvent: (eventId: string) => void;
    approveRequest: (eventId: string, userId: string) => void;
    blockUser: (userId: string) => void;
    unblockUser: (userId: string) => void;
    reportUser: (userId: string, reason: string) => void;
    initializeRealtime: () => Promise<void>;
    updateLocation: (lat: number, lng: number) => Promise<void>;
    cleanSession: () => void;
    _hasInitializedRealtime?: boolean;
}

export const useStore = create<Store>((set) => ({
    currentUser: CURRENT_USER,
    nearbyUsers: MOCK_USERS,
    events: [
        ...MOCK_EVENTS,
        ...LANDMARKS.map(place => ({
            id: `landmark-${place.name.replace(/\s+/g, '-').toLowerCase()}`,
            hostId: 'system',
            title: place.name,
            description: `Permanent chat group for ${place.name}`,
            location: { lat: place.lat, lng: place.lng },
            time: 'Always Open',
            type: place.type,
            isPrivate: false,
            attendees: [],
            pendingRequests: [],
            maxAttendees: undefined // Explicitly unlimited
        }))
    ],
    stories: MOCK_STORIES,
    connections: {},
    requests: {
        incoming: [],
        outgoing: []
    },
    messages: {},

    setUser: (user) => set({ currentUser: user }),
    updateProfile: async (user: User) => {
        const { supabase } = await import('./supabase');
        set({ currentUser: user });
        const { error } = await supabase.from('users').update({
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatar_url: user.avatar,
            city: user.city // New field
        }).eq('id', user.id);

        if (error) console.error("Failed to update profile:", error);
    },

    toggleVisibility: () => set((state) => {
        if (!state.currentUser) return state;
        return {
            currentUser: {
                ...state.currentUser,
                status: state.currentUser.status === 'online' ? 'offline' : 'online'
            }
        };
    }),

    sendRequest: (userId) => set((state) => ({
        requests: {
            ...state.requests,
            outgoing: [...state.requests.outgoing, userId]
        }
    })),

    acceptRequest: (userId, tier = 'normal') => set((state) => ({
        connections: { ...state.connections, [userId]: tier },
        requests: {
            ...state.requests,
            incoming: state.requests.incoming.filter(id => id !== userId)
        }
    })),

    sendMessage: (receiverId, content, type = 'text') => set((state) => {
        if (!state.currentUser) return state;

        // Determine if receiver is an event (Group Chat) or User (DM)
        const isEvent = state.events.some(e => e.id === receiverId);
        let channelId = receiverId;

        // If it's a DM, create canonical thread ID
        if (!isEvent) {
            // Sort IDs to ensure both users see the same thread
            channelId = [state.currentUser.id, receiverId].sort().join('-');
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: state.currentUser.id,
            receiverId, // Keep original intention (who it was sent to)
            content,
            type, // 'text' or 'summon'
            timestamp: new Date().toISOString(),
            read: false
        };

        const conversation = state.messages[channelId] || [];

        return {
            messages: {
                ...state.messages,
                [channelId]: [...conversation, newMessage]
            }
        };
    }),

    // Old local createEvent removed in favor of async action below
    // createEvent: (eventData) => set((state) => { ... }),

    deleteEvent: (eventId) => set((state) => ({
        events: state.events.filter(e => e.id !== eventId)
    })),

    // Advanced Event Actions
    joinEvent: (eventId) => set((state) => {
        if (!state.currentUser) return state;
        const event = state.events.find(e => e.id === eventId);
        if (!event) return state;

        // If private, add to pending. If public, add to attendees (if space)
        if (event.isPrivate) {
            return {
                events: state.events.map(e => e.id === eventId ? {
                    ...e,
                    pendingRequests: [...e.pendingRequests, state.currentUser!.id]
                } : e)
            };
        } else {
            // Check limit
            if (event.maxAttendees && event.attendees.length >= event.maxAttendees) return state;

            // Auto-initialize chat or send generic join message
            const joinMsg: Message = {
                id: Date.now().toString(),
                senderId: 'system',
                receiverId: eventId,
                content: `Welcome ${state.currentUser!.name}`,
                timestamp: new Date().toISOString(),
                read: false
            };

            const existingChat = state.messages[eventId] || [];

            return {
                events: state.events.map(e => e.id === eventId ? {
                    ...e,
                    attendees: [...e.attendees, state.currentUser!.id]
                } : e),
                messages: {
                    ...state.messages,
                    [eventId]: [...existingChat, joinMsg]
                }
            };
        }
    }),

    leaveEvent: (eventId) => set((state) => {
        if (!state.currentUser) return state;
        return {
            events: state.events.map(e => e.id === eventId ? {
                ...e,
                attendees: e.attendees.filter(id => id !== state.currentUser!.id)
            } : e)
        };
    }),

    createEvent: async (eventData: any) => {
        const { supabase } = await import('./supabase');
        const user = useStore.getState().currentUser;
        if (!user) return;

        // Optimistic UI update could happen here, but we'll wait for realtime callback to keep it simple and robust

        const { error } = await supabase.from('events').insert([{
            host_id: user.id,
            title: eventData.title,
            description: eventData.description,
            type: eventData.type,
            location: `POINT(${eventData.location.lng} ${eventData.location.lat})`,
            start_time: new Date().toISOString(), // Simplified "Now"
            is_private: eventData.isPrivate,
            max_attendees: eventData.maxAttendees
        }]);

        if (error) {
            console.error("Failed to create event:", error);
            alert(`Could not drop event: ${error.message}`);
        }
    },

    approveRequest: (eventId, userId) => set((state) => ({
        events: state.events.map(e => e.id === eventId ? {
            ...e,
            pendingRequests: e.pendingRequests.filter(id => id !== userId),
            attendees: [...e.attendees, userId]
        } : e)
    })),

    addStory: (storyData) => set((state) => {
        if (!state.currentUser) return state;

        const newStory: Story = {
            id: Date.now().toString(),
            userId: state.currentUser.id,
            timestamp: new Date().toISOString(),
            ...storyData
        };

        return {
            stories: [newStory, ...state.stories]
        };
    }),

    isAuthenticated: false,
    login: () => set({ isAuthenticated: true }),
    cleanSession: () => set({ isAuthenticated: false, currentUser: null }),
    logout: async () => {
        const { supabase } = await import('./supabase');
        await supabase.auth.signOut();
        set({ isAuthenticated: false, currentUser: null });
    },

    blockUser: (userId) => set((state) => {
        if (!state.currentUser) return state;
        const blocked = state.currentUser.blockedUsers || [];
        if (blocked.includes(userId)) return state;

        return {
            currentUser: {
                ...state.currentUser,
                blockedUsers: [...blocked, userId]
            },
            // Remove connection if exists
            connections: (() => {
                const newConnections = { ...state.connections };
                delete newConnections[userId];
                return newConnections;
            })()
        };
    }),

    unblockUser: (userId) => set((state) => {
        if (!state.currentUser) return state;
        const blocked = state.currentUser.blockedUsers || [];
        return {
            currentUser: {
                ...state.currentUser,
                blockedUsers: blocked.filter(id => id !== userId)
            }
        };
    }),

    reportUser: (userId, reason) => {
        console.log(`[REPORT] User ${userId} reported for: ${reason}`);
        // In a real app, this would send an API request
        alert("User reported. Thank you for keeping Ghostly safe.");
    },
    // Realtime Implementation
    initializeRealtime: async () => {
        const { supabase } = await import('./supabase');

        // 1. Initial Fetch
        // Cast geography to geometry to get coordinates
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*, lat: st_y(location::geometry), lng: st_x(location::geometry)')
            .neq('status', 'offline');

        if (userError) console.error("Error fetching users:", userError);

        if (users) {
            set({
                nearbyUsers: users.map(u => ({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    username: u.username,
                    bio: u.bio,
                    avatar: u.avatar_url,
                    // Parse PostGIS point if possible, or fallback to mock loc for demo if null
                    // For MVP: We assume location is stored as simple JSON or we parse it.
                    // Since our schema used GEOGRAPHY(POINT), we need to select st_x/st_y or similar.
                    // To keep it simple for this MVP step: we will just use random offsets if null
                    avatar: u.avatar_url,
                    // Use the aliased columns
                    location: { lat: u.lat || (40.7128 + Math.random() * 0.01), lng: u.lng || (-74.0060 + Math.random() * 0.01) },
                    status: u.status,
                    status: u.status,
                    city: u.city,
                    lastActive: '',
                    interests: []
                }))
            });
        }

        // 2. Subscribe to Users
        supabase.channel('public:users')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
                const newUser = payload.new as any;
                if (!newUser) return;

                set(state => {
                    const exists = state.nearbyUsers.find(u => u.id === newUser.id);
                    const mappedUser: User = {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        username: newUser.username,
                        bio: newUser.bio,
                        avatar: newUser.avatar_url,
                        username: newUser.username,
                        bio: newUser.bio,
                        avatar: newUser.avatar_url,
                        // For realtime updates, payload might still be raw. 
                        // ideally we'd refetch or parse, but simplified: assume simple update or fallback
                        // Realtime payload does NOT support computed columns. 
                        // We might need to rely on the client knowing the location if they just updated it, 
                        // or ignoring slightly stale format until refresh. 
                        // However, for correct "I see you move", we need the coords.
                        // Supabase Realtime *does* send the new row. If it's WKB (string), we can't parse easily in JS without a library (wkx).
                        // WORKAROUND: For this prototype, we won't fix realtime location parsing perfectly without 'wkx'.
                        // We will fallback to existing location if parsing fails, or use random if new.
                        // Users will need to refresh to see precise other-user movement if we don't parse WKB.
                        location: exists?.location || { lat: 0, lng: 0 },
                        status: newUser.status,
                        city: newUser.city,
                        lastActive: new Date().toISOString(),
                        interests: []
                    };

                    if (exists) {
                        return { nearbyUsers: state.nearbyUsers.map(u => u.id === mappedUser.id ? mappedUser : u) };
                    } else {
                        return { nearbyUsers: [...state.nearbyUsers, mappedUser] };
                    }
                });
            })
            .subscribe();

        // 3. Fetch & Subscribe to Events
        const { data: events, error: eventError } = await supabase
            .from('events')
            .select('*, lat: st_y(location::geometry), lng: st_x(location::geometry)');

        if (eventError) console.error("Error fetching events:", eventError);

        if (events) {
            set({
                events: events.map(e => ({
                    id: e.id,
                    hostId: e.host_id,
                    title: e.title,
                    description: e.description,
                    title: e.title,
                    description: e.description,
                    type: e.type as any,
                    // Use the aliased columns from the select
                    location: { lat: e.lat || 0, lng: e.lng || 0 },
                    time: e.start_time ? new Date(e.start_time).toLocaleTimeString() : 'Now',
                    isPrivate: e.is_private,
                    attendees: [], // We need to fetch these separately or join, for MVP we start empty
                    pendingRequests: [],
                    city: 'Unknown'
                }))
            });
        }

        supabase.channel('public:events')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
                const newEvent = payload.new as any;
                const eventId = newEvent?.id || (payload.old as any)?.id;

                if (payload.eventType === 'DELETE') {
                    set(state => ({ events: state.events.filter(e => e.id !== eventId) }));
                    return;
                }

                // Insert or Update
                if (newEvent) {
                    set(state => {
                        const exists = state.events.find(e => e.id === newEvent.id);
                        const mappedEvent: Event = {
                            id: newEvent.id,
                            hostId: newEvent.host_id,
                            title: newEvent.title,
                            description: newEvent.description,
                            type: newEvent.type,
                            location: newEvent.location ? { lat: newEvent.location.lat, lng: newEvent.location.lng } : { lat: 0, lng: 0 },
                            time: newEvent.start_time ? new Date(newEvent.start_time).toLocaleTimeString() : 'Now',
                            isPrivate: newEvent.is_private,
                            attendees: exists?.attendees || [],
                            pendingRequests: exists?.pendingRequests || [],
                            maxAttendees: newEvent.max_attendees
                        };

                        if (exists) {
                            return { events: state.events.map(e => e.id === mappedEvent.id ? mappedEvent : e) };
                        } else {
                            return { events: [...state.events, mappedEvent] };
                        }
                    });
                }
            })
            .subscribe();
    },

    updateLocation: async (lat: number, lng: number) => {
        const { supabase } = await import('./supabase');
        const user = useStore.getState().currentUser;
        if (!user) return;

        // Optimistic update
        set(state => ({
            currentUser: { ...state.currentUser!, location: { lat, lng } }
        }));

        // Send to DB (Throttled ideally, but raw for now)
        // Note: Writing to PostGIS column requires `st_point(lng, lat)` usually,
        // unless we used a simple jsonb column.
        // For this MVP to work easily with the JS client without specialized queries:
        // We will just store it as a JSON object in a separate column if Geography is too hard to write directly via JS client insert
        // OR we try to cast.
        // Let's assume we update the `location` column treating it as JSONB for simplicity OR we added a json column.
        // Wait, I defined it as GEOGRAPHY(POINT). Writing to it via supabase-js requires a specific format.
        // "POINT(lng lat)" string often works.

        await supabase.from('users').update({
            location: `POINT(${lng} ${lat})`,
            location_updated_at: new Date().toISOString()
        }).eq('id', user.id);
    }
}));
