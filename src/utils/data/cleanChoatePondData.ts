import { BlueCoLabData, CleanedWaterData } from '@/types/water.interface';

export const cleanChoatePondData = (rawData: BlueCoLabData[]) => {
    return rawData.map((item: BlueCoLabData) => {
        const { sensors, timestamp } = item;
        return { timestamp, ...sensors } as CleanedWaterData;
    });
};
