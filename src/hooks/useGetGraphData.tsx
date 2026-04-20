import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { subMonths, getYear, getMonth, getDaysInMonth } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';

import useGetClosestStation from '@/hooks/useClosestStation';
import { config } from '@/hooks/useConfig';
import { LocationType } from '@/types/location.type';

import useGetWaterData from './useGetWaterData';

// This hook provides the same API as before, but is now a proper hook, not a context provider.
export default function useGetGraphData() {
    const { fetchWaterData } = useGetWaterData();

    const closestStation = useGetClosestStation();

    // 2. State for user selections (filters) remains the same.
    const [year, setYear] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [startDay, setStartDay] = useState<number>();
    const [endDay, setEndDay] = useState<number>();
    // Secondary month/year/day range for comparison
    const [year2, setYear2] = useState<number>();
    const [month2, setMonth2] = useState<number>();
    const [startDay2, setStartDay2] = useState<number>();
    const [endDay2, setEndDay2] = useState<number>();
    const [defaultLocation, setDefaultLocation] = useState<LocationType>();
    const [defaultLocationName, setDefaultLocationName] = useState<string>();

    const [selectedLocation, setSelectedLocation] = useState<LocationType>();
    const [defaultTempUnit, setDefaultTempUnit] = useState<string>();
    const [showConvertedUnits, setShowConvertedUnits] = useState<boolean>(false);
    const [normalizeComparative, setNormalizeComparativeState] = useState<boolean>(false);
    const [selectedLocation2, setSelectedLocation2] = useState<LocationType>();

    // Determine the active location to be used in the query.
    const activeLocation = selectedLocation ?? defaultLocation;
    const activeLocation2 = selectedLocation2;

    // 3. The useQuery hook replaces the main data-fetching useEffect.
    const {
        data,
        error,
        isLoading: loading, // Alias isLoading to loading
    } = useQuery({
        // The query key includes all variables that the data depends on.
        // React Query will automatically refetch when any of these change.
        queryKey: ['graphWaterData', activeLocation, year, month, startDay, endDay],

        // The query function calls your fetcher with the current state values.
        queryFn: () => fetchWaterData(activeLocation!, false, year!, month!, startDay!, endDay!),

        // This query will only run when all its dependencies have values.
        enabled: !!(activeLocation && year && month && startDay && endDay),
    });

    // Second dataset for comparison (optional)
    const {
        data: data2,
        error: error2,
        isLoading: loading2,
    } = useQuery({
        queryKey: ['graphWaterData2', activeLocation2, year2, month2, startDay2, endDay2],
        queryFn: () =>
            fetchWaterData(activeLocation2!, false, year2!, month2!, startDay2!, endDay2!),
        enabled: !!(activeLocation2 && year2 && month2 && startDay2 && endDay2),
    });

    const changeTemperatureUnit = (newUnit: string) => {
        setDefaultTempUnit(newUnit);
    };

    const changeLocation = (newLocation: LocationType) => {
        if (newLocation.name == config.USGS_WATER_SERVICES_API_CONFIG.validMatches[0].name) {
            setDefaultLocation(closestStation.closestStation);
        } else {
            setDefaultLocation(newLocation);
        }
    };

    const setNormalizeComparative = (enabled: boolean) => {
        setNormalizeComparativeState(enabled);
    };

    // The initial useEffect to load settings and set the default date remains the same.

    const changeConvertedUnits = (enabled: boolean) => {
        setShowConvertedUnits(enabled);
    };
    const { location } = useLocalSearchParams<{ location?: string }>();

    const listOfSLocations = useMemo(
        () => [
            ...config.BLUE_COLAB_WATER_API_CONFIG.validMatches,
            ...config.USGS_WATER_SERVICES_API_CONFIG.validMatches,
        ],
        []
    );

    useEffect(() => {
        const getStoredDefaultLocation = async () => {
            try {
                if (location !== null) {
                    const finalLocation = listOfSLocations.find(
                        (loc) =>
                            loc.name.trim().toLocaleLowerCase() ===
                            location?.trim().toLocaleLowerCase()
                    );

                    if (finalLocation) {
                        setDefaultLocation(finalLocation);
                    } else {
                        setDefaultLocation({
                            name: 'Choate Pond',
                            lat: 41.127494,
                            long: -73.808235,
                        });
                    }
                } else {
                    setDefaultLocation({ name: 'Choate Pond', lat: 41.127494, long: -73.808235 });
                    setDefaultLocationName('Choate Pond');
                    setSelectedLocation({ name: 'Choate Pond', lat: 41.127494, long: -73.808235 });
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredDefaultLocationName = async () => {
            try {
                const value = await AsyncStorage.getItem('default-location');
                if (value !== null) {
                    const station: LocationType = JSON.parse(value);
                    setDefaultLocationName(station.name);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredDefaultTempUnit = async () => {
            try {
                const value = await AsyncStorage.getItem('default-temp-unit');
                if (value !== null) {
                    setDefaultTempUnit(value);
                } else {
                    setDefaultTempUnit('Fahrenheit');
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredConvertedUnits = async () => {
            try {
                const value = await AsyncStorage.getItem('show-converted-units');
                if (value !== null) {
                    setShowConvertedUnits(JSON.parse(value));
                } else {
                    setShowConvertedUnits(false);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredNormalizeComparative = async () => {
            try {
                const value = await AsyncStorage.getItem('normalize-comparative');
                if (value !== null) {
                    setNormalizeComparativeState(JSON.parse(value));
                } else {
                    setNormalizeComparativeState(false);
                }
            } catch (e) {
                console.error(e);
            }
        };

        void getStoredDefaultLocation();
        void getStoredDefaultTempUnit();
        void getStoredConvertedUnits();
        void getStoredNormalizeComparative();
        void getStoredDefaultLocationName();

        const lastMonth = subMonths(new Date(), 1);
        setYear(getYear(lastMonth));
        setMonth(getMonth(lastMonth) + 1);
        setStartDay(1);
        setEndDay(getDaysInMonth(lastMonth));

        // Initialize secondary date range to mirror primary by default
        const lastMonth2 = subMonths(new Date(), 1);
        setYear2(getYear(lastMonth2));
        setMonth2(getMonth(lastMonth2) + 1);
        setStartDay2(1);
        setEndDay2(getDaysInMonth(lastMonth2));
    }, [listOfSLocations, location]);

    return {
        // Values from useQuery
        data,
        data2,
        error: error ? { message: error.message } : undefined,
        error2: error2 ? { message: error2.message } : undefined,
        loading,
        loading2,
        // State and setters that remain
        defaultLocation,
        defaultLocationName,
        defaultTempUnit,
        showConvertedUnits,
        selectedLocationTemp: selectedLocation?.name,
        selectedLocationTemp2: selectedLocation2?.name,
        changeLocation,
        setYear,
        setMonth,
        setYear2,
        setMonth2,
        normalizeComparative,
        setLoading: () => {},
        setEndDay,
        setEndDay2,
        setDefaultLocation,
        changeTemperatureUnit,
        setSelectedLocationTemp: setSelectedLocation,
        setSelectedLocationTemp2: setSelectedLocation2,
        changeConvertedUnits,
        setNormalizeComparative,
    };
}
