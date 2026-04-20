import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';

// import { OpenWeatherAQI } from '@/types/water.interface';

const waterReportsCache = require('@/assets/water-reports-api.json');

export default function useGetWaterReportsData() {
    const networkState = useNetworkState();

    const TIMEOUT_MS = 5000;
    const fetchWaterReportsData = useCallback(
        async (year: string): Promise<any> => {
            if (networkState.isInternetReachable === false) {
                throw new Error('No internet connection');
            }

            // fetch base URL with timeout
            const base_url = await axios.get('https://aquawatchmobile.expo.app/api/waterreports', {
                timeout: TIMEOUT_MS,
            });

            const url = `${base_url.data.api_address}/waterReports/latest/report/year/${year}`;

            try {
                const response = await axios.get(url, { timeout: TIMEOUT_MS });
                const apiData = response.data;
                return apiData;
            } catch (error) {
                // Log the original error for debugging
                console.error('Data fetching error:', error);

                // Handle axios timeout specifically
                if (isAxiosError(error)) {
                    // Axios uses code 'ECONNABORTED' for timeouts
                    if (
                        (error as any).code === 'ECONNABORTED' ||
                        (error as any).code === 'ERR_NETWORK'
                    ) {
                        console.log(
                            'Request timed out after',
                            TIMEOUT_MS,
                            'ms, trying by fetching from file instead.'
                        );
                        return waterReportsCache.filter((item: any) => item.Years === year);
                    }
                    if (error.response?.status === 404) {
                        throw new Error('No data available for the selected date range.');
                    }
                    if (error.response) {
                        throw new Error(`HTTP Error: ${error.response.status}`);
                    }
                    if (error.request) {
                        throw new Error('No response from server. Check your network connection.');
                    }
                } else {
                    throw new Error('An unknown error occurred while fetching data.');
                }
            }
        },
        [networkState.isInternetReachable]
    );

    return {
        fetchWaterReportsData,
    };
}
