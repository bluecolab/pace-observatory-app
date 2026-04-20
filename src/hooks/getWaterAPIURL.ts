import { LocationType } from '@/types/location.type';

import { config } from './useConfig';

const getBlueColabWaterQuery = (
    isCurrentData: boolean,
    year: number,
    month: number,
    start_day: number,
    end_day: number
) => {
    return isCurrentData
        ? `${config.BLUE_COLAB_WATER_API_CONFIG.defaultMeasurement}/${config.BLUE_COLAB_WATER_API_CONFIG.currentDataQuery}`
        : `${config.BLUE_COLAB_WATER_API_CONFIG.defaultMeasurement}/${config.BLUE_COLAB_WATER_API_CONFIG.rangeDataQuery(year, month, start_day, end_day)}`;
};

const getUSGSWaterQuery = (
    isCurrentData: boolean,
    stationId: string,
    year: number,
    month: number,
    start_day: number,
    end_day: number
) => {
    return isCurrentData
        ? config.USGS_WATER_SERVICES_API_CONFIG.currentDataQuery(stationId)
        : config.USGS_WATER_SERVICES_API_CONFIG.rangeDataQuery(
              stationId,
              year,
              month,
              start_day,
              end_day
          );
};

const getAPIUrl = (
    defaultLocation: LocationType,
    isCurrentData: boolean,
    year: number,
    month: number,
    start_day: number,
    end_day: number,
    stationIds: { [key: string]: string }
) => {
    let baseURL = '';
    let query = '';

    const isBlueColabLocation = config.BLUE_COLAB_WATER_API_CONFIG.validMatches.some(
        (loc) => loc.name === defaultLocation.name
    );
    const isUSGSLocation = config.USGS_WATER_SERVICES_API_CONFIG.validMatches.some(
        (loc) => loc.name === defaultLocation.name
    );

    if (isBlueColabLocation) {
        baseURL = config.BLUE_COLAB_API_URL;
        query = getBlueColabWaterQuery(isCurrentData, year, month, start_day, end_day);
    } else if (isUSGSLocation) {
        const stationId =
            stationIds[defaultLocation.name as keyof typeof stationIds] ??
            config.USGS_WATER_SERVICES_API_CONFIG.defaultStation;
        baseURL = config.USGS_WATER_SERVICES_API_URL;
        query = getUSGSWaterQuery(isCurrentData, stationId, year, month, start_day, end_day);
    } else {
        throw new Error('Invalid location provided');
    }

    return `${baseURL}/${query}`;
};

export const getWaterAPIURL = () => {
    return {
        getAPIUrl,
    };
};
