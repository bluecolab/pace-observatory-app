import { CleanedWaterData, SensorData } from '@/types/water.interface';

export default function dataUtils() {
    const generateDataSummary = (
        data: CleanedWaterData[] | undefined,
        loading: boolean,
        finalUnitToUse?: string,
        defaultTempUnit?: string,
        data2?: CleanedWaterData[] | undefined
    ) => {
        if (!data || loading || (!Array.isArray(data) && loading)) {
            return {
                dailySummary: [],
                overallMin: 'N/A' as 'N/A',
                overallMax: 'N/A' as 'N/A',
                overallAvg: 'N/A' as 'N/A',
                tickValues: [],
            };
        }

        interface GroupedData {
            [day: number]: number[];
        }

        // Group the data by day-of-month (1..31) so we can align across different months
        const groupedData: GroupedData = data.reduce((acc: GroupedData, item: any) => {
            const day = new Date(item.timestamp).getDate();
            const value =
                finalUnitToUse === 'Temp' && defaultTempUnit?.trim() === 'Fahrenheit'
                    ? item[finalUnitToUse] * (9 / 5) + 32
                    : item[finalUnitToUse ?? 'Temp'];
            if (!acc[day]) acc[day] = [];
            acc[day].push(value);
            return acc;
        }, {} as GroupedData);

        const groupedData2: GroupedData = data2
            ? data2.reduce((acc: GroupedData, item: any) => {
                  const day = new Date(item.timestamp).getDate();
                  const value =
                      finalUnitToUse === 'Temp' && defaultTempUnit?.trim() === 'Fahrenheit'
                          ? item[finalUnitToUse] * (9 / 5) + 32
                          : item[finalUnitToUse ?? 'Temp'];
                  if (!acc[day]) acc[day] = [];
                  acc[day].push(value);
                  return acc;
              }, {} as GroupedData)
            : ([] as never as GroupedData);

        // Use the union of day keys from both datasets, sorted ascending
        const allDays = Array.from(
            new Set([
                ...Object.keys(groupedData).map((k) => Number.parseInt(k, 10)),
                ...Object.keys(groupedData2).map((k) => Number.parseInt(k, 10)),
            ])
        ).sort((a, b) => a - b);

        const dailySummary = allDays.map((day): DailySummaryType => {
            const cleanedGroupedData = (groupedData[day] ?? []).filter(
                (v) => v !== undefined && v !== null && !Number.isNaN(v as number)
            ) as number[];

            const cleanedGroupedData2 = (groupedData2[day] ?? []).filter(
                (v) => v !== undefined && v !== null && !Number.isNaN(v as number)
            ) as number[];
            return {
                day,
                avg: cleanedGroupedData
                    ? cleanedGroupedData.reduce((sum, v) => sum + v, 0) / cleanedGroupedData.length
                    : undefined,
                min: cleanedGroupedData ? Math.min(...cleanedGroupedData) : undefined,
                max: cleanedGroupedData ? Math.max(...cleanedGroupedData) : undefined,
                ...(data2
                    ? {
                          avg2: cleanedGroupedData2
                              ? cleanedGroupedData2.reduce((sum, v) => sum + v, 0) /
                                cleanedGroupedData2.length
                              : undefined,
                          min2: cleanedGroupedData2 ? Math.min(...cleanedGroupedData2) : undefined,
                          max2: cleanedGroupedData2 ? Math.max(...cleanedGroupedData2) : undefined,
                      }
                    : {}),
            };
        });

        dailySummary.forEach((ele: DailySummaryType) => {
            ele.avg = !isNaN(ele.avg ?? NaN) && ele.avg !== -999999 ? ele.avg : undefined;
            ele.min = !isNaN(ele.min ?? NaN) && ele.min !== -999999 ? ele.min : undefined;
            ele.max = !isNaN(ele.max ?? NaN) && ele.max !== -999999 ? ele.max : undefined;
            if (data2) {
                ele.avg2 = !isNaN(ele.avg2 ?? NaN) && ele.avg2 !== -999999 ? ele.avg2 : undefined;
                ele.min2 = !isNaN(ele.min2 ?? NaN) && ele.min2 !== -999999 ? ele.min2 : undefined;
                ele.max2 = !isNaN(ele.max2 ?? NaN) && ele.max2 !== -999999 ? ele.max2 : undefined;
            }
        });

        // Calculate overall min, max, and average
        const allValues = Object.values(groupedData)
            .flat()
            .filter((value) => value !== undefined && !Number.isNaN(value));
        let overallMin = 0;
        let overallMax = 0;
        let overallAvg = 0;
        overallMin = Math.min(...allValues);
        overallMax = Math.max(...allValues);
        overallAvg = allValues.reduce((sum, value) => sum + value, 0) / allValues.length;

        const tickValues = dailySummary
            .map(({ day }, index) => (index % 5 === 0 ? day : null))
            .filter(Boolean);

        const allUndefined = dailySummary.every(
            (entry) => entry.avg === undefined && entry.min === undefined && entry.max === undefined
        );

        if (allUndefined) {
            return {
                dailySummary: [],
                overallMin: 'N/A' as 'N/A',
                overallMax: 'N/A' as 'N/A',
                overallAvg: 'N/A' as 'N/A',
                tickValues: [],
            };
        }

        return {
            dailySummary,
            overallMin,
            overallMax,
            overallAvg,
            tickValues,
        };
    };

    const averageSensors = (data: SensorData[]): SensorData =>
        data.reduce<SensorData>(
            (acc, { Cond, DOpct, Sal, Temp, Turb, pH }) => {
                acc.Cond += Cond;
                acc.DOpct += DOpct;
                acc.Sal += Sal;
                acc.Temp += Temp;
                acc.Turb += Turb;
                acc.pH += pH;
                return acc;
            },
            { Cond: 0, DOpct: 0, Sal: 0, Temp: 0, Turb: 0, pH: 0 } // Initial accumulator
        );

    const calculateWQI = (data: SensorData[], loading: boolean): number => {
        let score = 0;

        if (!loading && data.length >= 1) {
            const const_dopct = 0.34;
            const const_ph = 0.22;
            const const_temp = 0.2;
            const const_cond = 0.08;
            const const_turb = 0.16;

            // Get averaged sensor data
            const sensorAverages = averageSensors(data);

            // Normalize sensor values
            Object.keys(sensorAverages).forEach((sensor) => {
                sensorAverages[sensor as keyof SensorData] /= data.length;
            });

            // Apply weights
            const result = {
                DOpct: sensorAverages.DOpct * const_dopct,
                pH: sensorAverages.pH * const_ph,
                Temp: sensorAverages.Temp * const_temp,
                Cond: sensorAverages.Cond * const_cond,
                Turb: sensorAverages.Turb * const_turb,
            };

            // Compute final score
            score = Math.round(Object.values(result).reduce((acc, value) => acc + value, 0));
        }

        return score;
    };

    return { generateDataSummary, calculateWQI };
}

export interface DailySummaryType {
    [key: string]: unknown;
    day: number;
    avg: number | undefined;
    min: number | undefined;
    max: number | undefined;
    avg2?: number | undefined;
    min2?: number | undefined;
    max2?: number | undefined;
}
