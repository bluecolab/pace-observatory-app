import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

import type { LocationType } from '@/types/location.type';

import { config } from './useConfig';

interface UseClosestStationResult {
    closestStation: LocationType | undefined;
    isLoading: boolean;
    errorMsg: string | null;
}

export default function useGetClosestStation(): UseClosestStationResult {
    const [closestStation, setClosestStation] = useState<LocationType | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Define an async function inside the effect
        const findClosestStation = async () => {
            try {
                // 1. Get location permission
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Permission to access location was denied');
                }

                // 2. Get the user's current position
                const currentLocation = await Location.getCurrentPositionAsync({});

                // 3. Immediately calculate the closest station (no intermediate state needed)
                const toRad = (value: number) => (value * Math.PI) / 180;
                const R = 6371; // Earth's radius in kilometers

                const allStations: LocationType[] = [
                    ...config.USGS_WATER_SERVICES_API_CONFIG.validMatches,
                ];

                let leastDistance = Infinity;
                let stationWithLeastDistance: LocationType | undefined = undefined;

                for (const station of allStations) {
                    if (station.lat == undefined || station.long == undefined) continue;

                    const dLat = toRad(station.lat - currentLocation.coords.latitude);
                    const dLon = toRad(station.long - currentLocation.coords.longitude);
                    const lat1 = toRad(currentLocation.coords.latitude);
                    const lat2 = toRad(station.lat);

                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;

                    if (distance < leastDistance) {
                        leastDistance = distance;
                        stationWithLeastDistance = station;
                    }
                }

                // 4. Set the final state once
                setClosestStation(stationWithLeastDistance);
            } catch (error) {
                // Handle any error from the process
                setErrorMsg(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                // 5. Mark loading as false, regardless of success or failure
                setIsLoading(false);
            }
        };

        // Call the async function
        void findClosestStation();
    }, []); // <-- The empty array ensures this effect runs ONLY ONCE.

    return { closestStation, isLoading, errorMsg };
}
