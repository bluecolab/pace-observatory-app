import React, { useMemo } from 'react';
import { Dimensions, View, Text } from 'react-native';

import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData } from '@/types/water.interface';
import dataUtils, { DailySummaryType } from '@/utils/data/dataUtils';
import normalize from '@/utils/data/normalize';

import { MonthlyDataCardFront } from './MonthlyDataCardFront';

interface ComparisonCardProps {
    loading: boolean;
    data: CleanedWaterData[] | undefined;
    error: ErrorType | undefined;
    defaultTempUnit: string | undefined;
    unitMap: Record<string, string | null>;
    selectedMonth: string;
    selectedLocationTemp: string | undefined;
    selectedLocationTemp2: string | undefined;
    normalizeComparative: boolean;
    showConvertedUnits?: boolean;
}

// Helper conversion functions to mirror MonthlyDataCard behavior
const uscmToPpt = (uscm: number) => uscm * 0.00055;
const psuToPpt = (psu: number) => psu; // passthrough for now

export default function ComparisonCard({
    loading,
    data,
    error,
    defaultTempUnit,
    unitMap,
    selectedMonth,
    normalizeComparative,
    selectedLocationTemp,
    selectedLocationTemp2,
    showConvertedUnits,
}: ComparisonCardProps) {
    const { generateDataSummary } = dataUtils();
    const { normalizeDailySummary } = normalize();
    // If converted units are OFF, auto-normalize to avoid one series appearing flattened
    const useNormalization = normalizeComparative || !showConvertedUnits;

    // Prepare datasets for Cond and Sal with optional conversions
    const { condData, salData } = useMemo(() => {
        if (!data) return { condData: data, salData: data };
        if (!showConvertedUnits) return { condData: data, salData: data };
        const cond = data.map((item) => {
            const next = { ...item };
            if (typeof item.Cond === 'number' && unitMap.Cond === 'µS/cm') {
                next.Cond = uscmToPpt(item.Cond);
            }
            return next;
        });
        const sal = data.map((item) => {
            const next = { ...item };
            if (typeof item.Sal === 'number' && unitMap.Sal === 'PSU') {
                next.Sal = psuToPpt(item.Sal);
            }
            return next;
        });
        return { condData: cond, salData: sal };
    }, [data, showConvertedUnits, unitMap]);

    // Build daily summaries for each parameter
    const condSummary = generateDataSummary(condData, loading, 'Cond', defaultTempUnit);
    const salSummary = generateDataSummary(salData, loading, 'Sal', defaultTempUnit);

    // Optionally normalize each independently to overlay fairly
    const normalizedCondDaily = useMemo(() => {
        if (!useNormalization || loading) return condSummary.dailySummary;
        const { daily } = normalizeDailySummary(condSummary.dailySummary);
        return daily;
    }, [useNormalization, loading, condSummary.dailySummary, normalizeDailySummary]);

    const normalizedSalDaily = useMemo(() => {
        if (!useNormalization || loading) return salSummary.dailySummary;
        const { daily } = normalizeDailySummary(salSummary.dailySummary);
        return daily;
    }, [useNormalization, loading, salSummary.dailySummary, normalizeDailySummary]);

    // Merge by day into a combined structure expected by Graph (avg/min/max + avg2/min2/max2)
    const combinedDaily: DailySummaryType[] = useMemo(() => {
        const byDay = new Map<number, DailySummaryType>();
        for (const d of normalizedCondDaily) {
            const day = d.day as number;
            byDay.set(day, { day, avg: d.avg, min: d.min, max: d.max });
        }
        for (const d of normalizedSalDaily) {
            const day = d.day as number;
            const prev = byDay.get(day) ?? { day };
            byDay.set(day, {
                ...prev,
                day,
                avg2: d.avg,
                min2: d.min,
                max2: d.max,
            } as DailySummaryType);
        }
        return Array.from(byDay.values()).sort((a, b) => (a.day as number) - (b.day as number));
    }, [normalizedCondDaily, normalizedSalDaily]);

    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;
    const title = 'Salinity vs Conductivity';
    const legend = (
        <View className="mt-1 flex-row items-center justify-center gap-4">
            <View className="flex-row items-center">
                <View style={{ width: 12, height: 12, backgroundColor: 'blue', marginRight: 6 }} />
                <Text className="dark:text-darkText">Conductivity</Text>
            </View>
            <View className="flex-row items-center">
                <View
                    style={{ width: 12, height: 12, backgroundColor: '#10b981', marginRight: 6 }}
                />
                <Text className="dark:text-darkText">Salinity</Text>
            </View>
        </View>
    );

    // Render using the existing Front card UI for consistency
    return (
        <View className="z-10 mt-10 h-[340] w-[95%] self-center">
            <View style={{ marginTop: 5, width: containerWidth, height: '100%' }}>
                <MonthlyDataCardFront
                    loading={loading}
                    dailySummary={combinedDaily}
                    error={error}
                    month={selectedMonth}
                    title={title}
                    legend={legend}
                    selectedLocationTemp={selectedLocationTemp}
                    selectedLocationTemp2={selectedLocationTemp2}
                />
            </View>
        </View>
    );
}
