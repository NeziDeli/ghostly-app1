import { create } from 'zustand';
import { AppState, User, Message, Event, Story } from './types';
import { MOCK_USERS, MOCK_EVENTS, MOCK_STORIES, CURRENT_USER } from './mockData';
import { LANDMARKS } from './places';

interface Store extends AppState {
    setUser: (user: User) => void;
    joinEvent: (eventId: string) => void;
    leaveEvent: (eventId: string) => void;
    approveRequest: (eventId: string, userId: string) => void;
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

    createEvent: (eventData) => set((state) => {
        if (!state.currentUser) return state;

        // Remove any existing event from this user first (Constraint: Single Event)
        const filteredEvents = state.events.filter(e => e.hostId !== state.currentUser?.id);

        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(),
            hostId: state.currentUser.id,
            attendees: [state.currentUser.id], // Host is first attendee
            pendingRequests: [],
            isPrivate: eventData.isPrivate || false,
            maxAttendees: eventData.maxAttendees
        };

        return {
            events: [...filteredEvents, newEvent]
        };
    }),

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
    logout: () => set({ isAuthenticated: false })
}));
