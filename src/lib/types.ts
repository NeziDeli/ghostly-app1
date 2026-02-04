export type UserStatus = 'online' | 'offline' | 'busy';
export type ConnectionStatus = 'none' | 'pending' | 'connected';

export interface User {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatar: string; // URL or placeholder color
    location: {
        lat: number;
        lng: number;
    };
    status: UserStatus;
    lastActive: string;
    interests: string[];
    relationshipTier?: 'normal' | 'soulbound';
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    type?: 'text' | 'summon';
    timestamp: string;
    read: boolean;
}

export interface Event {
    id: string;
    hostId: string;
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    time: string;
    type: 'chill' | 'party' | 'study' | 'food' | 'sport' | 'music' | 'landmark' | 'server' | 'nature' | 'historical' | 'shopping';
    // Advanced Features
    maxAttendees?: number;
    isPrivate: boolean;
    attendees: string[];
    pendingRequests: string[];
    city?: string;
}

export interface Story {
    id: string;
    userId: string;
    text?: string;
    imageUrl?: string;
    type: 'image' | 'text';
    timestamp: string;
    color?: string; // Background color for text stories
}

export interface AppState {
    currentUser: User | null;
    nearbyUsers: User[];
    events: Event[];
    stories: Story[];
    connections: Record<string, 'normal' | 'soulbound'>; // Key: User ID, Value: Tier
    requests: {
        incoming: string[]; // User IDs
        outgoing: string[]; // User IDs
    };
    messages: Record<string, Message[]>; // Keyed by partner ID

    // Actions
    toggleVisibility: () => void;
    sendRequest: (userId: string) => void;
    acceptRequest: (userId: string, tier?: 'normal' | 'soulbound') => void;
    sendMessage: (receiverId: string, content: string, type?: 'text' | 'summon') => void;
    createEvent: (event: Omit<Event, 'id' | 'hostId'>) => void;
    deleteEvent: (eventId: string) => void;
    addStory: (story: Omit<Story, 'id' | 'userId' | 'timestamp'>) => void;

    // Auth
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;

    // Advanced Event Actions
    joinEvent: (eventId: string) => void;
    approveRequest: (eventId: string, userId: string) => void;
    setUser: (user: User) => void;
}
