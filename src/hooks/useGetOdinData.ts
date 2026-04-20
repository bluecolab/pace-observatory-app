import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { config } from '@/hooks/useConfig';
import { OdinData } from '@/types/water.interface';

export default function useGetOdinData() {
    const networkState = useNetworkState();

    const fetchOdinData = useCallback(async (): Promise<OdinData> => {
        if (networkState.isInternetReachable === false) {
            throw new Error('No internet connection');
        }
        const url = config.BLUE_COLAB_API_ODIN_URL;

        try {
            const response =
                Platform.OS === 'web'
                    ? await await axios.post('/api/bluecolab', {
                          request: url,
                      })
                    : await axios.get(url);
            const apiData = response.data;
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
        fetchOdinData, // Export the new promise-based function
    };
}
