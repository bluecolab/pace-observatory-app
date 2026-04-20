import {
    CleanedWaterData,
    ParameterName,
    TimeSeries,
    WaterServicesData,
} from '@/types/water.interface';
import { roundToNearest15Minutes } from '@/utils/data/roundToNearest15Minutes';
import getMetadata from '@/utils/getMetadata';

const USGSParameterMappingsEnum: { [key: string]: string } = (() => {
    const { usgsParameterMappings } = getMetadata();
    return Object.fromEntries(
        Object.entries(usgsParameterMappings).map(([key, value]) => [key, value])
    ) as { [key: string]: string };
})();

export const cleanHudsonRiverData = (rawData: WaterServicesData) => {
    if (!rawData?.value?.timeSeries) {
        console.error('Here Invalid data format');
        return [];
    }

    const parsedData: CleanedWaterData[] = [];

    rawData.value.timeSeries.forEach((series: TimeSeries) => {
        const paramCode = series.variable.variableCode[0].value;
        const paramName = USGSParameterMappingsEnum[paramCode];

        if (!paramName) return; // Skip unneeded parameters

        const valuesList =
            series.values[0].value.length > 0
                ? series.values[0].value
                : (series.values[1]?.value ?? []);

        valuesList.forEach((entry) => {
            const rawTimestamp = entry.dateTime;
            const timestamp = roundToNearest15Minutes(rawTimestamp);
            const value = parseFloat(entry.value);

            let existingEntry = parsedData.find((data) => data.timestamp === timestamp);

            if (!existingEntry) {
                existingEntry = {
                    timestamp,
                } as CleanedWaterData;
                parsedData.push(existingEntry);
            }
            (existingEntry as any)[paramName as ParameterName] = value;
        });
    });

    return parsedData;
};
