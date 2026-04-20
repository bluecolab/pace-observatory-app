import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

import { useUserSettings } from '@/contexts/UserSettingsContext';
import useGetClosestStation from '@/hooks/useClosestStation';
import { config } from '@/hooks/useConfig';
import useGetAQIData from '@/hooks/useGetAQIData';
import useGetOdinData from '@/hooks/useGetOdinData';
import useGetWaterData from '@/hooks/useGetWaterData';
import useGetWaterReportsData from '@/hooks/useGetWaterReportsData';
import { LocationType } from '@/types/location.type';
import { CleanedWaterData, OdinData, OpenWeatherAQI } from '@/types/water.interface';

interface CurrentDataContextType {
    waterData: CleanedWaterData[] | undefined;
    airData?: OdinData | undefined;
    aqiData?: OpenWeatherAQI | undefined;
    waterReportsData?: any | undefined;
    closestStation: LocationType | undefined;
    waterError: Error | null;
    airError: Error | null;
    aqiError: Error | null;
    reportsError: Error | null;
    loadingCurrent: boolean;
    refetchCurrent: () => void;
}

const defaultContext: CurrentDataContextType = {
    waterData: undefined,
    airData: undefined,
    aqiData: undefined,
    waterReportsData: undefined,
    closestStation: undefined,
    waterError: null,
    airError: null,
    aqiError: null,
    reportsError: null,
    loadingCurrent: false,
    refetchCurrent: () => {},
};

const CurrentDataContext = createContext<CurrentDataContextType>(defaultContext);

export default function CurrentDataProvider({ children }: { children: ReactNode }) {
    const { defaultTemperatureUnit } = useUserSettings();
    const { fetchWaterData } = useGetWaterData();
    const { fetchOdinData } = useGetOdinData();
    const { fetchAQIData } = useGetAQIData();
    const { fetchWaterReportsData } = useGetWaterReportsData();

    const closestStation = useGetClosestStation();

    // Choate Pond
    const {
        data: waterData,
        error: waterError,
        isFetching: waterFetching,
        isPending: waterPending,
        refetch: refetchWater,
    } = useQuery<CleanedWaterData[], Error>({
        queryKey: [
            'currentData',
            config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0],
            defaultTemperatureUnit,
        ],
        enabled: true,
        queryFn: async () =>
            fetchWaterData(
                config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0] as LocationType,
                true,
                0,
                0,
                0,
                0
            ),
        placeholderData: [],
        gcTime: 1000 * 60 * 5,
        staleTime: 1000 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });

    // Air Data Query
    const {
        data: airData,
        error: airError,
        refetch: refetchAir,
    } = useQuery({
        queryKey: [
            'airData',
            config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0],
            defaultTemperatureUnit,
        ],
        queryFn: () => fetchOdinData(),
        enabled: true,
        refetchInterval: 15 * 60 * 1000,
    });

    // AQI Data Query
    const {
        data: aqiData,
        error: aqiError,
        refetch: refetchAQI,
    } = useQuery({
        queryKey: ['aqiData', config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0]],
        queryFn: () =>
            fetchAQIData(
                config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0].lat as number,
                config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0].long as number
            ),
        enabled: true,
    });

    // Water Reports Data Query
    const { data: waterReportsData, error: reportsError } = useQuery({
        queryKey: ['waterReportsData', config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0]],
        queryFn: () => fetchWaterReportsData('2023'),
        enabled: true,
        retry: 1,
    });

    const refetchCurrent = useCallback(() => {
        void refetchWater();
        void refetchAir();
        void refetchAQI();
    }, [refetchWater, refetchAir, refetchAQI]);

    const contextValue = useMemo(
        () => ({
            waterData: waterData ?? [],
            airData,
            aqiData,
            waterReportsData,
            closestStation: closestStation.closestStation,
            waterError,
            airError,
            aqiError,
            reportsError,
            loadingCurrent: waterFetching || waterPending,
            refetchCurrent,
        }),
        [
            waterData,
            airData,
            aqiData,
            waterReportsData,
            closestStation.closestStation,
            waterError,
            airError,
            aqiError,
            reportsError,
            waterFetching,
            waterPending,
            refetchCurrent,
        ]
    );

    return (
        <CurrentDataContext.Provider value={contextValue}>{children}</CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
