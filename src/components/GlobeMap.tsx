"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, Map as MapIcon, Users, MessageSquare, User, Menu } from "lucide-react";
import CreateEventModal from "./CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { Event } from "@/lib/types";
import { MAJOR_CITIES } from "@/lib/cities";
import { LANDMARKS } from "@/lib/places";
import * as THREE from 'three';



// Import react-globe.gl dynamically to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeMap() {
    const { currentUser, nearbyUsers, events, createEvent, joinEvent, leaveEvent, connections } = useStore();
    const router = useRouter();
    const globeEl = useRef<any>(null);

    const [showModal, setShowModal] = useState(false);
    const [newLocation, setNewLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [draftEventType, setDraftEventType] = useState<string>('chill');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Calculate Sun Position & Lighting
    useEffect(() => {
        // ... (existing helper code for sun position remains same, omitted for brevity if unchanged, but since this is replace_file_content I need to be careful not to delete it if I don't include it. 
        // Actually, I can just target the specific chunks.)
    }, [currentUser]); // Wait, I can't skip lines in replace_file_content like that if I target a large block.

    // Better to do smaller chunks.


    // Calculate Sun Position & Lighting
    useEffect(() => {
        if (globeEl.current) {
            const globe = globeEl.current;
            const scene = globe.scene();
            const controls = globe.controls();

            // Fix "Too to the right": Center the controls target
            controls.target.set(0, 0, 0);

            // Zoom Limits: Allow closer zoom for "pristine" look, limit far zoom
            controls.minDistance = 100.001; // Surface is 100. Allow 0.001 distance.
            controls.maxDistance = 300; // Constrain zoom out so it fills screen more
            controls.enablePan = false;
            controls.autoRotate = false;

            // Approximate Sun Position
            const now = new Date();
            const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
            const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
            const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
            const sunLng = (12 - utcHours) * 15;
            const sunLat = declination;

            // Clean up old lights
            const sunName = "RealTimeSun";
            const ambientName = "GlobalAmbient";
            scene.children.forEach((c: any) => {
                if (c.name === sunName || c.name === ambientName) {
                    scene.remove(c);
                }
            });

            // Bright Sun
            const sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
            sunLight.name = sunName;

            const phi = (90 - sunLat) * (Math.PI / 180);
            const theta = (sunLng + 180) * (Math.PI / 180);
            const r = 200;

            sunLight.position.set(
                -(r * Math.sin(phi) * Math.cos(theta)),
                r * Math.cos(phi),
                r * Math.sin(phi) * Math.sin(theta)
            );

            scene.add(sunLight);

            // Strong Ambient Light
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
            ambientLight.name = ambientName;
            scene.add(ambientLight);

            // Set initial POV - Focus on Puerto Rico
            globe.pointOfView({
                lat: 18.2208,
                lng: -66.5901,
                altitude: 0.15 // Closer zoom to see the island details
            });
        }
    }, [currentUser]);

    const handleGlobeClick = ({ lat, lng }: { lat: number; lng: number }) => {
        setNewLocation({ lat, lng });
        setShowModal(true);
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

    // Combine users and events into HTML markers
    const markers = [
        ...nearbyUsers.map(user => ({
            id: user.id,
            lat: user.location.lat,
            lng: user.location.lng,
            type: 'user',
            data: user,
            color: user.avatar
        })),
        ...events.map(event => ({
            id: event.id,
            lat: event.location.lat,
            lng: event.location.lng,
            type: 'event',
            data: event,
            color: '#FFD700' // Gold
        })),
        ...(currentUser ? [{
            id: currentUser.id,
            lat: currentUser.location.lat,
            lng: currentUser.location.lng,
            type: 'me',
            data: currentUser,
            color: '#8a7cff'
        }] : []),
        ...(newLocation ? [{
            id: 'draft-pin',
            lat: newLocation.lat,
            lng: newLocation.lng,
            type: 'draft',
            data: { title: 'New Event', type: draftEventType },
            color: '#ffffff'
        }] : []),
        ...MAJOR_CITIES.map(city => ({
            id: `city-${city.name}`,
            lat: city.lat,
            lng: city.lng,
            type: 'city',
            data: city,
            color: '#cccccc'
        }))
    ];

    // Calculate Soulbound Tethers
    const tetherLinks = currentUser ? nearbyUsers
        .filter(u => connections[u.id] === 'soulbound')
        .map(u => ({
            startLat: currentUser.location.lat,
            startLng: currentUser.location.lng,
            endLat: u.location.lat,
            endLng: u.location.lng,
            color: 'rgba(255, 215, 0, 0.4)' // Gold
        })) : [];

    return (
        <div className="h-full w-full absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
            <Globe
                ref={globeEl}
                rendererConfig={{
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                    logarithmicDepthBuffer: true, // Prevents Z-fighting at close zoom
                    powerPreference: "high-performance"
                }}
                // Use Satellite Tiles for "Pristine" Zoom Quality
                globeImageUrl={null}
                bumpImageUrl={null}
                globeTileEngineUrl={(x: number, y: number, l: number) =>
                    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${l}/${y}/${x}`
                }
                backgroundColor="#0a0a0c"
                atmosphereColor="#8a7cff"
                atmosphereAltitude={0.15}
                onGlobeClick={handleGlobeClick}

                // Tethers
                arcsData={tetherLinks}
                arcColor={'color'}
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={2000}
                arcStroke={1.5}
                arcAltitude={0.05} // Low altitude tether

                htmlElementsData={markers}
                htmlElement={(d: any) => {
                    const el = document.createElement('div');

                    if (d.type === 'me') {
                        // Create pulse effect using CSS in JS manner or just inline styles with animation name if defined globally.
                        // Since we can't easily add global keyframes here, we'll use a simple scale transform in a loop or similar? 
                        // Actually, let's just use a high-visibility design.
                        el.innerHTML = `
                            <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
                                <div style="
                                    width: 40px; height: 40px;
                                    background: rgba(138, 124, 255, 0.3);
                                    border-radius: 50%;
                                    position: absolute;
                                    animation: pulse 2s infinite;
                                "></div>
                                <div style="
                                    width: 24px; height: 24px; 
                                    background: ${d.color}; 
                                    border-radius: 50%; 
                                    border: 3px solid white;
                                    box-shadow: 0 0 15px ${d.color};
                                    z-index: 2;
                                    display: flex; align-items: center; justify-content: center;
                                ">
                                    <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
                                </div>
                                <div style="
                                    margin-top: 8px;
                                    background: rgba(0,0,0,0.7);
                                    color: white;
                                    padding: 2px 6px;
                                    border-radius: 4px;
                                    font-size: 10px;
                                    font-weight: bold;
                                    pointer-events: none;
                                    white-space: nowrap;
                                ">YOU</div>
                                <style>
                                    @keyframes pulse {
                                        0% { transform: scale(1); opacity: 0.8; }
                                        70% { transform: scale(2.5); opacity: 0; }
                                        100% { transform: scale(1); opacity: 0; }
                                    }
                                </style>
                            </div>
                        `;
                    } else if (d.type === 'event') {
                        const isSelected = selectedEvent?.id === d.id;

                        // Expanded Card Style
                        if (isSelected) {
                            el.style.zIndex = "1000"; // Bring to front
                            const isAttending = d.data.attendees?.includes(currentUser?.id);

                            el.innerHTML = `
                                <div style="
                                    display: flex; flex-direction: column; align-items: start;
                                    color: white; 
                                    background: rgba(20, 20, 25, 0.85); 
                                    backdrop-filter: blur(12px);
                                    padding: 16px; 
                                    border-radius: 20px;
                                    border: 1px solid rgba(255, 255, 255, 0.1); 
                                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                                    transform: translate(-50%, -105%);
                                    width: 240px;
                                    cursor: default;
                                    pointer-events: auto;
                                    font-family: 'Inter', sans-serif;
                                    transition: all 0.2s ease;
                                ">
                                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${d.data.type === 'chill' ? '☕' :
                                    d.data.type === 'party' ? '🎉' :
                                        d.data.type === 'food' ? '🍔' :
                                            d.data.type === 'study' ? '📚' :
                                                d.data.type === 'sport' ? '⚽' :
                                                    d.data.type === 'music' ? '🎵' :
                                                        d.data.type === 'nature' ? '🏔️' :
                                                            d.data.type === 'shopping' ? '🛍️' :
                                                                d.data.type === 'historical' ? '🏛️' : '📍'
                                }</span>
                                            <div style="display: flex; flex-direction: column;">
                                               <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.5); font-weight: 700;">
                                                   ${['landmark', 'shopping', 'nature', 'historical'].includes(d.data.type) ? 'GROUP' : 'EVENT'}
                                               </span>
                                               <span style="font-size: 10px; color: #4ade80; display: flex; align-items: center; gap: 3px;">
                                                   ● ${d.data.attendees.length || 0} active
                                               </span>
                                            </div>
                                        </div>
                                        <button id="close-btn-${d.id}" style="
                                            background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; 
                                            width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                            font-size: 14px; transition: background 0.2s;
                                        ">✕</button>
                                    </div>
                                    
                                    <h3 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 700; color: white; line-height: 1.2;">${d.data.title}</h3>
                                    
                                    <p style="margin: 0 0 16px 0; font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4;">
                                        ${d.data.hostId === 'system' ? 'Public Space • Always Open' : (d.data.city ? d.data.city : d.data.description || 'Join the conversation.')}
                                    </p>

                                    ${isAttending ? `
                                        <div style="display: flex; gap: 8px; width: 100%;">
                                            <button id="chat-btn-${d.id}" style="
                                                flex: 1;
                                                background: rgba(255,255,255,0.1); 
                                                color: white; 
                                                border: 1px solid rgba(255,255,255,0.2);
                                                padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer;
                                                font-size: 13px; transition: all 0.2s;
                                            ">
                                                Active Chat
                                            </button>
                                            <button id="leave-btn-${d.id}" style="
                                                padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer;
                                                font-size: 13px; transition: all 0.2s;
                                                background: rgba(255, 77, 77, 0.15); 
                                                color: #ff6b6b; 
                                                border: 1px solid rgba(255, 77, 77, 0.3);
                                            ">
                                                Leave
                                            </button>
                                        </div>
                                    ` : `
                                        <button id="join-btn-${d.id}" style="
                                            width: 100%; 
                                            background: white; 
                                            color: black; 
                                            border: none;
                                            padding: 10px; border-radius: 12px; font-weight: 700; cursor: pointer;
                                            font-size: 13px; 
                                            box-shadow: 0 4px 12px rgba(255,255,255,0.2);
                                            transition: transform 0.2s;
                                        ">
                                            Join Group
                                        </button>
                                    `}
                                </div>
                            `;
                        } else {
                            // Collapsed Style
                            if (['landmark', 'server', 'nature', 'historical', 'shopping'].includes(d.data.type)) {
                                // Landmark/Server Style (Interactive)
                                const isServer = d.data.type === 'server';
                                const isShopping = d.data.type === 'shopping';
                                const isNature = d.data.type === 'nature';
                                const isHistorical = d.data.type === 'historical';

                                el.innerHTML = `
                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer; transition: transform 0.2s;">
                                        <div style="font-size: ${isServer ? '24px' : '14px'}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                                            ${isServer ? '🌐' : isShopping ? '🛍️' : isNature ? '🏔️' : isHistorical ? '🏛️' : '📍'}
                                        </div>
                                        <div style="
                                            color: ${isServer ? '#00ffff' : '#50fa7b'};
                                            font-size: ${isServer ? '10px' : '8px'};
                                            font-weight: 600;
                                            font-family: sans-serif;
                                            text-shadow: 0 1px 3px rgba(0,0,0,0.9);
                                            white-space: nowrap;
                                            margin-top: 2px;
                                            ${isServer ? 'text-transform: uppercase; letter-spacing: 1px;' : ''}
                                        ">
                                            ${d.data.title}
                                        </div>
                                    </div>
                                `;
                                el.onmouseenter = () => { el.style.transform = 'translate(-50%, -50%) scale(1.2)'; };
                                el.onmouseleave = () => { el.style.transform = 'translate(-50%, -50%) scale(1)'; };

                            } else {
                                // Standard Event Pill
                                el.innerHTML = `
                                    <div style="
                                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                                        color: white; background: rgba(0,0,0,0.8); padding: 6px; border-radius: 8px;
                                        border: 1px solid ${d.color}; font-size: 10px; font-weight: bold;
                                        transform: translate(-50%, -100%);
                                        cursor: pointer;
                                        pointer-events: auto;
                                        user-select: none;
                                        min-width: 40px;
                                        transition: all 0.2s;
                                    ">
                                        <span style="font-size: 24px; line-height: 1.2; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">${d.data.type === 'chill' ? '☕' :
                                        d.data.type === 'party' ? '🎉' :
                                            d.data.type === 'food' ? '🍔' :
                                                d.data.type === 'study' ? '📚' :
                                                    d.data.type === 'sport' ? '⚽' :
                                                        d.data.type === 'music' ? '🎵' : '📍'
                                    }</span>
                                        <span style="margin-top: 4px; text-shadow: 0 1px 2px black;">${d.data.title}</span>
                                    </div>
                                `;
                            }
                        }

                        const stopPropagation = (e: any) => {
                            e.stopPropagation();
                            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                        };

                        el.addEventListener('pointerdown', stopPropagation);
                        el.addEventListener('mousedown', stopPropagation);

                        // Attach specific handlers for expanded state
                        if (isSelected) {
                            // We need to wait for DOM insertion to attach handlers to inner elements? 
                            // No, innerHTML creates them immediately but we can't select them easily until attached?
                            // Actually, we can attach handlers to the *container* and delegate or use getElementById after render?
                            // Since react-globe.gl appends this element, we can add listeners to `el` that check target.

                            el.onclick = (e: any) => {
                                e.stopPropagation();
                                const target = e.target as HTMLElement;

                                // Close Button
                                if (target.id === `close-btn-${d.id}` || target.innerText === '✕') {
                                    setSelectedEvent(null);
                                    return;
                                }

                                // Join Button
                                if (target.id === `join-btn-${d.id}` || target.innerText === 'Join Group' || target.innerText === 'Join Event') {
                                    joinEvent(d.id);
                                    setSelectedEvent(null);

                                    // Zoom in on join
                                    if (globeEl.current) {
                                        globeEl.current.pointOfView({
                                            lat: d.lat,
                                            lng: d.lng,
                                            altitude: 0.05 // Closer zoom
                                        }, 2000); // 2 seconds animation
                                    }
                                    return;
                                }

                                // Leave Button
                                if (target.id === `leave-btn-${d.id}` || target.innerText === 'Leave Group' || target.innerText === 'Leave' || target.innerText === 'Leave Event') {
                                    leaveEvent(d.id);
                                    setSelectedEvent(null);
                                    return;
                                }

                                // Chat Button
                                if (target.id === `chat-btn-${d.id}` || target.innerText === 'Active Chat') {
                                    router.push(`/messages/${d.id}`);
                                    return;
                                }
                            };
                        } else {
                            el.onclick = (e: any) => {
                                e.stopPropagation();
                                setSelectedEvent(d.data);

                                // Fly to event - Ultra Low Surface Level
                                if (globeEl.current) {
                                    globeEl.current.pointOfView({
                                        lat: d.lat,
                                        lng: d.lng,
                                        altitude: 0.0005
                                    }, 2000);
                                }
                            };
                        }
                    } else if (d.type === 'city') {
                        el.innerHTML = `
                            <div style="
                                color: rgba(255, 255, 255, 0.7);
                                font-size: 8px;
                                font-weight: 600;
                                font-family: sans-serif;
                                text-shadow: 0 1px 3px rgba(0,0,0,0.9);
                                white-space: nowrap;
                                pointer-events: none;
                                transform: translate(-50%, -50%);
                                letter-spacing: 0.5px;
                            ">
                                • ${d.data.name}
                            </div>
                        `;
                    } else if (d.type === 'landmark') {
                        el.innerHTML = `
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -50%); pointer-events: none;">
                                <div style="font-size: 14px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                                    ${d.data.type === 'nature' ? '🏔️' :
                                d.data.type === 'shopping' ? '🛍️' : '🏛️'}
                                </div>
                                <div style="
                                    color: #50fa7b;
                                    font-size: 8px;
                                    font-weight: 600;
                                    font-family: sans-serif;
                                    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
                                    white-space: nowrap;
                                    margin-top: 2px;
                                ">
                                    ${d.data.name}
                                </div>
                            </div>
                        `;
                    } else {
                        // User (and others)
                        const isSoulbound = connections[d.data.id] === 'soulbound';

                        // Default User Logic
                        el.innerHTML = `
                            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                                ${isSoulbound ? `
                                    <div style="
                                        width: 24px; height: 24px;
                                        background: rgba(255, 215, 0, 0.4);
                                        border-radius: 50%;
                                        position: absolute;
                                        animation: pulse 3s infinite;
                                        pointer-events: none;
                                    "></div>
                                ` : ''}
                                <div style="
                                    width: 12px; height: 12px; 
                                    background: ${d.color}; 
                                    border-radius: 50%; 
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                    border: ${isSoulbound ? '2px solid gold' : 'none'};
                                    box-shadow: ${isSoulbound ? '0 0 10px gold' : 'none'};
                                    z-index: 2;
                                "></div>
                            </div>
                        `;
                        el.onclick = () => router.push(`/messages/${d.id}`);
                        el.onmouseenter = () => { el.style.transform = 'scale(1.5)'; };
                        el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
                    }

                    return el;
                }}
            />

            {/* Floating Navigation Dock */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[5000] flex items-center gap-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in-down">
                {[
                    { href: "/feed", icon: Users, label: "Nearby" },
                    { href: "/messages", icon: MessageSquare, label: "Chats" },
                    { href: "/profile", icon: User, label: "Profile" }
                ].map((item) => (
                    <button
                        key={item.label}
                        onClick={() => router.push(item.href)}
                        className="p-3 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 group relative"
                    >
                        <item.icon size={20} />
                        <span className="sr-only">{item.label}</span>
                        {/* Tooltip */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded-md pointer-events-none whitespace-nowrap">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Recenter Button */}
            <button
                onClick={() => {
                    if (currentUser && globeEl.current) {
                        globeEl.current.pointOfView({
                            lat: currentUser.location.lat,
                            lng: currentUser.location.lng,
                            altitude: 0.2
                        }, 1000);
                    }
                }}
                className="absolute bottom-32 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 hover-scale z-[5000]"
                title="Find Me"
            >
                <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full relative">
                        <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-75"></div>
                    </div>
                </div>
            </button>

            {
                showModal && newLocation && (
                    <CreateEventModal
                        location={newLocation}
                        onClose={() => {
                            setShowModal(false);
                            setNewLocation(null);
                            setDraftEventType('chill'); // Reset
                        }}
                        onTypeChange={setDraftEventType}
                        onSubmit={handleCreateEvent}
                    />
                )
            }
        </div >
    );
}
