import axios, { isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { OpenWeatherAQI } from '@/types/water.interface';
import { calculateUSAQI } from '@/utils/calculateUSAQI';

const getOpenWeatherApiUrl = () => {
    if (Platform.OS === 'web') {
        return '/api/openweathermap';
    }

    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        return `http://${hostUri}/api/openweathermap`;
    }

    const apiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN?.trim();
    if (apiOrigin) {
        return `${apiOrigin.replace(/\/$/, '')}/api/openweathermap`;
    }

    throw new Error(
        'Missing API origin. Set EXPO_PUBLIC_API_ORIGIN for native builds, or run web against the Expo origin.'
    );
};

export default function useGetAQIData() {
    const networkState = useNetworkState();

    const fetchAQIData = useCallback(async (): Promise<OpenWeatherAQI> => {
        if (networkState.isInternetReachable === false) {
            throw new Error('No internet connection');
        }

        try {
            const response = await axios.get(getOpenWeatherApiUrl());
            const apiData = response.data as OpenWeatherAQI;

            // Validate that we have data in the list (runtime check)
            if (!apiData.list?.[0]?.components) {
                throw new Error('No air quality data available for this location.');
            }

            // Calculate US EPA AQI from pollutant concentrations
            const components = apiData.list[0].components;
            const usAQI = calculateUSAQI({
                co: components.co,
                no2: components.no2,
                o3: components.o3,
                so2: components.so2,
                pm2_5: components.pm2_5,
                pm10: components.pm10,
            });

            // Add US AQI to the response
            apiData.usAQI = usAQI;

            return apiData;
        } catch (error) {
            // Log the original error for debugging
            console.error('Data fetching error:', error);

            // Re-throw a new, user-friendly error for React Query to catch
            if (isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('No data available for the selected date range.');
                }
                if (error.response) {
                    throw new Error(`HTTP Error: ${error.response.status}`);
                }
                if (error.request) {
                    throw new Error('No response from server. Check your network connection.');
                }
            }
            throw new Error('An unknown error occurred while fetching data.');
        }
    }, [networkState.isInternetReachable]);

    return {
        fetchAQIData,
    };
}
