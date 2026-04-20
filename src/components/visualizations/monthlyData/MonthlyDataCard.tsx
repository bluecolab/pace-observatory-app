import { useMemo, useRef } from 'react';
import { Dimensions, View, Pressable } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData } from '@/types/water.interface';
import dataUtils from '@/utils/data/dataUtils';
import normalize from '@/utils/data/normalize';

import { MonthlyDataCardBack } from './MonthlyDataCardBack';
import { MonthlyDataCardFront } from './MonthlyDataCardFront';

const titleLabel = (
    unitMap: Record<string, string | null>,
    finalUnitToUse: string | undefined,
    showConvertedUnits: boolean | undefined,
    defaultTempUnit: string | undefined,
    yAxisLabel: string
): string => {
    if (!unitMap || finalUnitToUse === 'pH') return `${yAxisLabel}`;

    if (finalUnitToUse === 'Temp') {
        return `${yAxisLabel} - ${defaultTempUnit?.trim() === 'Fahrenheit' ? '°F' : unitMap[finalUnitToUse]}`;
    }

    let displayUnit = unitMap[finalUnitToUse ?? 'Temp'];
    if (showConvertedUnits) {
        if (finalUnitToUse === 'Cond' && unitMap.Cond === 'µS/cm') {
            displayUnit = 'ppt';
        } else if (finalUnitToUse === 'Turb' && unitMap.Turb === 'FNU') {
            displayUnit = 'NTU';
        } else if (finalUnitToUse === 'Sal' && unitMap.Sal === 'PSU') {
            displayUnit = 'ppt';
        }
    }
    return `${yAxisLabel} - ${displayUnit}`;
};

interface MonthlyDataCardProps {
    loading: boolean;
    yAxisLabel: string;
    data: CleanedWaterData[] | undefined;
    data2?: CleanedWaterData[] | undefined;
    error: ErrorType | undefined;
    unit: string;
    meta: {
        description: string;
        reason: string;
        ref: {
            label: string;
            link: string;
        }[];
    };
    defaultTempUnit: string | undefined;
    unitMap: Record<string, string | null>;
    selectedLocationTemp: string | undefined;
    selectedLocationTemp2: string | undefined;
    selectedMonth: string;
    showConvertedUnits?: boolean;
    normalizeComparative?: boolean;
    alternateName: string;
}

export function MonthlyDataCard({
    loading,
    yAxisLabel,
    data,
    data2,
    error,
    unit,
    meta,
    defaultTempUnit,
    unitMap,
    alternateName,
    selectedLocationTemp,
    selectedLocationTemp2,
    selectedMonth,
    showConvertedUnits,
    normalizeComparative,
}: MonthlyDataCardProps) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;
    const { generateDataSummary } = dataUtils();
    const { normalizeDailySummary } = normalize();

    // Conversion helpers for historical data
    const uscmToPpt = (uscm: number) => uscm * 0.00055;
    const fnuToNtu = (fnu: number) => fnu;
    const psuToPpt = (psu: number) => psu;

    // Apply conversions only to the active unit when toggled on
    const convertedData = useMemo(() => {
        if (!showConvertedUnits || !data) return data;

        return data.map((item) => {
            const next = { ...item };
            switch (unit) {
                case 'Cond':
                    if (typeof item.Cond === 'number' && unitMap.Cond === 'µS/cm') {
                        next.Cond = uscmToPpt(item.Cond);
                    }
                    break;
                case 'Turb':
                    if (typeof item.Turb === 'number' && unitMap.Turb === 'FNU') {
                        next.Turb = fnuToNtu(item.Turb);
                    }
                    break;
                case 'Sal':
                    if (typeof item.Sal === 'number' && unitMap.Sal === 'PSU') {
                        next.Sal = psuToPpt(item.Sal);
                    }
                    break;
                default:
                    break;
            }
            return next;
        });
    }, [showConvertedUnits, data, unit, unitMap]);

    const convertedData2 = useMemo(() => {
        if (!showConvertedUnits || !data2) return data2;

        return data2.map((item) => {
            const next = { ...item };
            switch (unit) {
                case 'Cond':
                    if (typeof item.Cond === 'number' && unitMap.Cond === 'µS/cm') {
                        next.Cond = uscmToPpt(item.Cond);
                    }
                    break;
                case 'Turb':
                    if (typeof item.Turb === 'number' && unitMap.Turb === 'FNU') {
                        next.Turb = fnuToNtu(item.Turb);
                    }
                    break;
                case 'Sal':
                    if (typeof item.Sal === 'number' && unitMap.Sal === 'PSU') {
                        next.Sal = psuToPpt(item.Sal);
                    }
                    break;
                default:
                    break;
            }
            return next;
        });
    }, [showConvertedUnits, data2, unit, unitMap]);

    const rawDataSummary = generateDataSummary(
        convertedData,
        loading,
        unit,
        defaultTempUnit,
        convertedData2
    );
    const isNormalized = normalizeComparative && !loading;
    const normalizedDaily = useMemo(() => {
        if (!isNormalized) return rawDataSummary.dailySummary;
        const { daily } = normalizeDailySummary(rawDataSummary.dailySummary);
        return daily;
    }, [isNormalized, rawDataSummary.dailySummary, normalizeDailySummary]);

    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;

    const flipCardRef = useRef<{ flip: () => void }>(null);
    const flipCard = () => flipCardRef.current?.flip();

    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Graph Container */}
                <View className="z-10 h-[340] w-[95%] self-center">
                    {/* Front View - Graph */}
                    <FlipCard
                        height={300}
                        Front={
                            <Pressable onPress={flipCard} style={{ flex: 1 }}>
                                <MonthlyDataCardFront
                                    loading={loading}
                                    dailySummary={normalizedDaily}
                                    error={error}
                                    month={selectedMonth}
                                    title={titleLabel(
                                        unitMap,
                                        finalUnitToUse,
                                        showConvertedUnits,
                                        defaultTempUnit,
                                        yAxisLabel
                                    )}
                                    selectedLocationTemp={selectedLocationTemp}
                                    selectedLocationTemp2={selectedLocationTemp2}
                                />
                            </Pressable>
                        }
                        Back={
                            <Pressable onPress={flipCard} style={{ flex: 1 }}>
                                <MonthlyDataCardBack
                                    overallMin={rawDataSummary.overallMin}
                                    overallMax={rawDataSummary.overallMax}
                                    overallAvg={rawDataSummary.overallAvg}
                                    yAxisLabel={yAxisLabel}
                                    meta={meta}
                                    flipCard={flipCard}
                                    title={titleLabel(
                                        unitMap,
                                        finalUnitToUse,
                                        showConvertedUnits,
                                        defaultTempUnit,
                                        yAxisLabel
                                    )}
                                />
                            </Pressable>
                        }
                        flipCardRef={flipCardRef}
                        frontStyles={{ marginTop: 5, width: containerWidth, height: '100%' }}
                        backStyles={{ marginTop: 5, width: containerWidth }}
                    />
                </View>
            </View>
        </View>
    );
}
