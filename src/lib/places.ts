export interface Place {
    name: string;
    lat: number;
    lng: number;
    type: 'landmark' | 'nature' | 'historical' | 'shopping' | 'server';
}

export const LANDMARKS: Place[] = [
    { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, type: 'landmark' },
    { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445, type: 'landmark' },
    { name: "Great Wall of China", lat: 40.4319, lng: 116.5704, type: 'historical' },
    { name: "Taj Mahal", lat: 27.1751, lng: 78.0421, type: 'historical' },
    { name: "Machu Picchu", lat: -13.1631, lng: -72.5450, type: 'historical' },
    { name: "Grand Canyon", lat: 36.1069, lng: -112.1129, type: 'nature' },
    { name: "Mt. Fuji", lat: 35.3606, lng: 138.7274, type: 'nature' },
    { name: "Sydney Opera House", lat: -33.8568, lng: 151.2153, type: 'landmark' },
    { name: "Burj Khalifa", lat: 25.1972, lng: 55.2744, type: 'landmark' },
    { name: "Colosseum", lat: 41.8902, lng: 12.4922, type: 'historical' },
    { name: "Pyramids of Giza", lat: 29.9792, lng: 31.1342, type: 'historical' },
    { name: "Christ the Redeemer", lat: -22.9519, lng: -43.2105, type: 'landmark' },
    { name: "Mona Lisa (Louvre)", lat: 48.8606, lng: 2.3376, type: 'historical' },
    { name: "Golden Gate Bridge", lat: 37.8199, lng: -122.4783, type: 'landmark' },
    { name: "Mount Everest", lat: 27.9881, lng: 86.9250, type: 'nature' },

    // Puerto Rico Landmarks
    { name: "El Yunque National Forest", lat: 18.3202, lng: -65.7932, type: 'nature' },
    { name: "Castillo San Felipe del Morro", lat: 18.4682, lng: -66.1211, type: 'historical' },
    { name: "Flamenco Beach (Culebra)", lat: 18.3283, lng: -65.3183, type: 'nature' },
    { name: "Bio Bay (Vieques)", lat: 18.0967, lng: -65.4411, type: 'nature' },
    { name: "Observatorio de Arecibo", lat: 18.3464, lng: -66.7528, type: 'landmark' },
    { name: "Cueva Ventana", lat: 18.3746, lng: -66.6922, type: 'nature' },
    { name: "Toro Verde Adventure Park", lat: 18.2934, lng: -66.3860, type: 'landmark' },
    { name: "Plaza Las Américas", lat: 18.4225, lng: -66.0736, type: 'shopping' }
];
