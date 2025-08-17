
'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/navigation';

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const MiniMap = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const router = useRouter();
    
    // State for current location
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    
    // Default location (SF) as fallback
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };
    
    // Function to get current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser');
            setCurrentLocation(defaultLocation);
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                setLocationError(null);
                setIsLoadingLocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationError('Unable to retrieve your location');
                setCurrentLocation(defaultLocation);
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    // Get current location on component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Initialize map when location is available
    useEffect(() => {
        if (map.current || !mapContainer.current || !currentLocation) return; // Initialize map only once and when location is available

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12', // Streets theme
            center: [currentLocation.lng, currentLocation.lat], // Use current location
            zoom: 14,
            interactive: false, // Make the map not interactive
        });

        // Add a marker for current location
        new mapboxgl.Marker()
            .setLngLat([currentLocation.lng, currentLocation.lat])
            .addTo(map.current);
            
    }, [currentLocation]);
    
    const handleMapClick = () => {
        router.push('/');
    };

    return (
        <div 
            ref={mapContainer} 
            className="relative h-full w-full rounded-lg cursor-pointer"
            onClick={handleMapClick}
        >
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                    {isLoadingLocation ? 'Loading location...' : 
                     locationError ? 'Location unavailable' :
                     'Your Location'}
                </span>
            </div>
        </div>
    );
};

export default MiniMap; 