import { User, Event, Story } from './types';

const AVATAR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
];

export const MOCK_STORIES: Story[] = [
    {
        id: 's1',
        userId: '1', // Alex
        text: 'View from the roof! 🌃',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        color: '#8a7cff'
    },
    {
        id: 's2',
        userId: '4', // Casey
        text: 'Who wants to game?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        color: '#FF6B6B'
    }
];

export const MOCK_EVENTS: Event[] = [
    {
        id: 'e1',
        hostId: '2', // Sam
        title: 'Coffee at The Loft',
        description: 'Working for a few hours. Come say hi!',
        location: { lat: 40.7138, lng: -74.0050 },
        time: 'Now',
        type: 'study',
        isPrivate: false,
        attendees: ['2'],
        pendingRequests: [],
        city: 'New York'
    },
    {
        id: 'e2',
        hostId: '3', // Jordan
        title: 'Sunset Photos',
        description: 'Heading to the pier for some shots.',
        location: { lat: 40.7110, lng: -74.0090 },
        time: '6:00 PM',
        type: 'chill',
        isPrivate: false,
        attendees: ['3'],
        pendingRequests: []
    },
    {
        id: 'e3',
        hostId: '6', // Kenji
        title: 'Akihabara Tech Run',
        description: 'Shopping for parts!',
        location: { lat: 35.6984, lng: 139.7731 }, // Akihabara
        time: '2:00 PM',
        type: 'shopping',
        isPrivate: false,
        attendees: ['6'],
        pendingRequests: [],
        city: 'Tokyo'
    }
];

export const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        username: '@arivera',
        bio: 'Exploring the city. love photography 📸',
        avatar: AVATAR_COLORS[0],
        location: { lat: 40.7128, lng: -74.0060 }, // NYC coordinates as base
        status: 'online',
        lastActive: 'Now',
        interests: ['Photography', 'Coffee', 'Urban'],
        relationshipTier: 'normal'
    },
    {
        id: '2',
        name: 'Sam Chen',
        username: '@samc',
        bio: 'Digital nomad looking for coffee spots ☕️',
        avatar: AVATAR_COLORS[1],
        location: { lat: 40.7138, lng: -74.0050 },
        status: 'online',
        lastActive: '5m ago',
        interests: ['Tech', 'Travel', 'Food'],
        relationshipTier: 'soulbound'
    },
    {
        id: '3',
        name: 'Jordan Taylor',
        username: '@jtaylor',
        bio: 'Here for the weekend! Any recommendations?',
        avatar: AVATAR_COLORS[2],
        location: { lat: 40.7118, lng: -74.0070 },
        status: 'busy',
        lastActive: '1h ago',
        interests: ['Music', 'Art', 'Nightlife'],
        relationshipTier: 'normal'
    },
    {
        id: '4',
        name: 'Casey Smith',
        username: '@casey',
        bio: 'Just chilling 👻',
        avatar: AVATAR_COLORS[3],
        location: { lat: 40.7148, lng: -74.0030 },
        status: 'offline',
        lastActive: '2h ago',
        interests: ['Movies', 'Gaming'],
        relationshipTier: 'soulbound'
    },
    {
        id: '5',
        name: 'Riley Quinn',
        username: '@rquinn',
        bio: 'Student at the university nearby.',
        avatar: AVATAR_COLORS[7],
        location: { lat: 40.7108, lng: -74.0080 },
        status: 'online',
        lastActive: 'Now',
        interests: ['Reading', 'Science']
    },
    {
        id: '6',
        name: 'Kenji Sato',
        username: '@kenji_tokyo',
        bio: 'Tech wanderer in Shibuya 🇯🇵',
        avatar: AVATAR_COLORS[4],
        location: { lat: 35.6580, lng: 139.7016 }, // Tokyo
        status: 'online',
        lastActive: '5m ago',
        interests: ['Anime', 'Tech', 'Ramen', 'Cyberpunk'],
        relationshipTier: 'normal'
    }
];

export const CURRENT_USER: User = {
    id: 'me',
    name: 'Ghost User',
    username: '@ghostly_me',
    bio: 'Invisible but present.',
    avatar: '#8a7cff', // Brand primary
    location: { lat: 40.7120, lng: -74.0055 },
    status: 'online',
    lastActive: 'Now',
    interests: ['Coding', 'Design']
};
