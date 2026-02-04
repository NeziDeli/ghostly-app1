import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { User, Event } from "@/lib/types";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, X, Calendar } from "lucide-react";
import CreateEventModal from "./CreateEventModal";

// Fix Leaflet icons
const iconPerson = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconMe = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconEvent = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map clicks
function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    useMapEvents({
        click: onMapClick,
    });
    return null;
}

// Component to recenter map
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
}

export default function Map() {
    const { currentUser, nearbyUsers, events, sendRequest, connections, createEvent } = useStore();
    const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);
    const [isPlacing, setIsPlacing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newLocation, setNewLocation] = useState<{ lat: number, lng: number } | null>(null);

    const router = useRouter();

    // Update center if user moves (mock)
    useEffect(() => {
        if (currentUser) {
            setCenter([currentUser.location.lat, currentUser.location.lng]);
        }
    }, [currentUser]);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (isPlacing) {
            setNewLocation(e.latlng);
            setShowModal(true);
            setIsPlacing(false); // Turn off placement mode after selecting
        }
    };

    const handleCreateEvent = (data: any) => {
        if (newLocation) {
            createEvent({
                ...data,
                location: newLocation
            });
            setShowModal(false);
            setNewLocation(null);
        }
    };

    if (!currentUser) return <div>Loading map...</div>;

    return (
        <div className="h-full w-full absolute inset-0 z-0">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapEvents onMapClick={handleMapClick} />

                {/* Me */}
                <Marker position={center} icon={iconMe}>
                    <Popup>
                        <div className="text-center">
                            <strong>You</strong> <br />
                            <span className="text-xs">{currentUser.status}</span>
                        </div>
                    </Popup>
                </Marker>

                {/* Others */}
                {nearbyUsers.map(user => (
                    <Marker
                        key={user.id}
                        position={[user.location.lat, user.location.lng]}
                        icon={iconPerson}
                    >
                        <Popup>
                            <div className="min-w-[150px] text-center p-2">
                                <strong className="text-lg block mb-1">{user.name}</strong>
                                <p className="text-sm text-gray-600 mb-2">{user.bio}</p>
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => router.push(`/messages/${user.id}`)}
                                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Chat
                                    </button>
                                    {!connections[user.id] && (
                                        <button
                                            onClick={() => sendRequest(user.id)}
                                            className="border border-purple-600 text-purple-600 px-3 py-1 rounded text-xs"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Events */}
                {events.map(event => (
                    <Marker
                        key={event.id}
                        position={[event.location.lat, event.location.lng]}
                        icon={iconEvent}
                    >
                        <Popup>
                            <div className="min-w-[150px] p-2 text-center">
                                <div className="flex items-center justify-center gap-1 text-[var(--ghost-primary)] mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold uppercase">{event.type}</span>
                                </div>
                                <strong className="text-lg block mb-1">{event.title}</strong>
                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                <div className="text-xs text-gray-500 bg-gray-100 dark:bg-zinc-800 rounded py-1 mb-2">
                                    {event.time}
                                </div>
                                {event.hostId === currentUser.id && (
                                    <span className="text-[10px] text-[var(--ghost-primary)] font-bold">Hosted by You</span>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapController center={center} />
            </MapContainer>

            {/* UI Overlay */}
            <div className="absolute bottom-24 right-4 z-[400] flex flex-col items-end gap-3 pointer-events-auto">
                {isPlacing && (
                    <div className="bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-md animate-fade-in-up mb-2 text-sm font-bold shadow-xl border border-[var(--ghost-primary)]">
                        Tap anywhere to place event
                    </div>
                )}

                <button
                    onClick={() => setIsPlacing(!isPlacing)}
                    className={`p-4 rounded-full shadow-lg transition-all duration-300 transform ${isPlacing
                        ? 'bg-red-500 rotate-45'
                        : 'bg-[var(--ghost-primary)] hover:scale-105 active:scale-95'
                        }`}
                >
                    <Plus size={24} color="white" strokeWidth={3} />
                </button>
            </div>

            {showModal && newLocation && (
                <CreateEventModal
                    location={newLocation}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateEvent}
                />
            )}
        </div>
    );
}
