export const config = {
    BLUE_COLAB_API_ODIN_URL: 'https://colabprod01.pace.edu/api/influx/sensordata/Odin',
    BLUE_COLAB_API_URL: 'https://colabprod01.pace.edu/api/influx/sensordata',
    BLUE_COLAB_WATER_API_CONFIG: {
        defaultMeasurement: 'Alan',
        currentDataQuery: 'delta?days=1',
        rangeDataQuery: (year: number, month: number, start_day: number, end_day: number) =>
            `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`,
        validMatches: [{ name: 'Choate Pond', lat: 41.127494, long: -73.808235 }],
    },
    USGS_WATER_SERVICES_API_URL: 'https://waterservices.usgs.gov/nwis/iv',
    USGS_WATER_SERVICES_API_CONFIG: {
        defaultStation: '01376269',
        parameterCd: '00010,00301,00300,90860,00095,63680,00400,62620',
        format: 'json',
        currentDataQuery: (stationId: string) =>
            `?sites=${stationId}&period=P2D&format=${config.USGS_WATER_SERVICES_API_CONFIG.format}&parameterCd=${config.USGS_WATER_SERVICES_API_CONFIG.parameterCd}`,
        rangeDataQuery: (
            stationId: string,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ) =>
            `?sites=${stationId}&startDT=${year}-${month.toString().padStart(2, '0')}-${start_day
                .toString()
                .padStart(2, '0')}&endDT=${year}-${month.toString().padStart(2, '0')}-${end_day
                .toString()
                .padStart(
                    2,
                    '0'
                )}&format=${config.USGS_WATER_SERVICES_API_CONFIG.format}&parameterCd=${config.USGS_WATER_SERVICES_API_CONFIG.parameterCd}`,
        validMatches: [
            { name: 'Nearest Station' },
            { name: 'Bronx River', lat: 40.86230556, long: -73.87438889 },
            { name: 'Albany', lat: 42.61952778, long: -73.7589167 },
            { name: 'Poughkeepsie', lat: 41.72058333, long: -73.93875 },
            { name: 'West Point', lat: 41.3862049, long: -73.95513879 },
            { name: 'Piermont', lat: 41.04319444, long: -73.8960556 },
            { name: 'New York City', lat: 40.72152778, long: -74.0156111 },
            { name: 'Gowanda', lat: 42.46344444, long: -78.9345278 },
            { name: 'Cohoes', lat: 42.78569444, long: -73.7104167 },
        ],
    },
    OPEN_WEATHER_API_URL: 'https://api.openweathermap.org',
};
