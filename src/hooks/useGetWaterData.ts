import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';

import { config } from '@/hooks/useConfig';
import { LocationType } from '@/types/location.type';
import { CleanedWaterData } from '@/types/water.interface';
import { cleanChoatePondData } from '@/utils/data/cleanChoatePondData';
import { cleanHudsonRiverData } from '@/utils/data/cleanHudsonRiverData';
import getMetadata from '@/utils/getMetadata';

import { getWaterAPIURL } from './getWaterAPIURL';

export default function useGetWaterData() {
    const { stationIds } = getMetadata();
    const { BLUE_COLAB_WATER_API_CONFIG } = config;
    const { getAPIUrl } = getWaterAPIURL();

    const networkState = useNetworkState();

    const fetchWaterData = useCallback(
        async (
            defaultLocation: LocationType,
            isCurrentData: boolean,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ): Promise<CleanedWaterData[]> => {
            if (networkState.isInternetReachable === false) {
                throw new Error('No internet connection');
            }

            try {
                const url = getAPIUrl(
                    defaultLocation,
                    isCurrentData,
                    year,
                    month,
                    start_day,
                    end_day,
                    stationIds
                );

                const response = await axios.get(url);
                const apiData = response.data;

                const isBlueColab = BLUE_COLAB_WATER_API_CONFIG.validMatches.some(
                    (loc) => loc.name === defaultLocation.name
                );
                const isUSGS = config.USGS_WATER_SERVICES_API_CONFIG.validMatches.some(
                    (loc) => loc.name === defaultLocation.name
                );

                if (isBlueColab) {
                    return cleanChoatePondData(apiData);
                } else if (isUSGS) {
                    return cleanHudsonRiverData(apiData);
                } else {
                    throw new Error('Invalid location provided');
                }
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
        },
        [
            getAPIUrl,
            stationIds,
            networkState.isInternetReachable,
            BLUE_COLAB_WATER_API_CONFIG.validMatches,
        ]
    );

    return {
        fetchWaterData,
    };
}
