import FontAwesome from "@react-native-vector-icons/fontawesome";
import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
// import { useGraphData } from '@/contexts/~GraphDataContext';
import { ErrorType } from '@/types/error.interface';
import { DailySummaryType } from '@/utils/data/dataUtils';

import { EmptyGraph } from '../EmptyGraph';

import Graph from './Graph';

interface MonthlyDataCardFrontProp {
    loading: boolean;
    dailySummary: DailySummaryType[];
    error: ErrorType | undefined;
    month: string;
    title: string;
    selectedLocationTemp: string | undefined;
    selectedLocationTemp2: string | undefined;
    legend?: ReactNode;
}

export function MonthlyDataCardFront({
    loading,
    dailySummary,
    error,
    month,
    title,
    selectedLocationTemp,
    selectedLocationTemp2,
    legend,
}: MonthlyDataCardFrontProp) {
    const { isDark, loading: fontLoading, font } = useColorScheme();

    const showSecondSet = dailySummary.some(
        ({ avg2, min2, max2 }) => avg2 !== undefined || min2 !== undefined || max2 !== undefined
    );

    if (fontLoading) {
        return <></>;
    }

    if (loading) {
        return (
            <View className="z-10 h-[340] w-[95%] self-center">
                <EmptyGraph
                    error={{
                        message: 'Loading...',
                        code: 0,
                    }}
                />
            </View>
        );
    } else if (error) {
        return <EmptyGraph error={error} />;
    } else if (dailySummary.length === 0) {
        return (
            <View className="z-10 h-[340] w-[95%] self-center">
                <EmptyGraph
                    error={{
                        message: 'Error: No data available',
                    }}
                />
            </View>
        );
    }

    return (
        <View className="h-[340] rounded-3xl bg-white px-2 dark:bg-darkCardBackground ">
            <View className="w-full self-center">
                <Text className="rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-darkCardBackground dark:text-darkText">
                    {title}
                </Text>
                <FontAwesome
                    className="absolute right-0 top-2"
                    name="info-circle"
                    size={32}
                    color={isDark ? 'white' : 'grey'}
                />
            </View>
            {/* Legend: custom when provided, else default location-based */}
            {legend ? (
                <View className="mb-1 mt-1 w-full items-center justify-center">{legend}</View>
            ) : (
                <View className="mb-1 mt-1 w-full flex-row items-center justify-center gap-6">
                    <View className="flex-row items-center">
                        <View style={{ width: 12, height: 3, backgroundColor: '#2563eb' }} />
                        <Text className="ml-2 text-xs text-black dark:text-darkText">
                            {selectedLocationTemp || 'Location 1'}
                        </Text>
                    </View>
                    {showSecondSet && (
                        <View className="flex-row items-center">
                            <View style={{ width: 12, height: 3, backgroundColor: '#f59e0b' }} />
                            <Text className="ml-2 text-xs text-black dark:text-darkText">
                                {selectedLocationTemp2 || 'Location 2'}
                            </Text>
                        </View>
                    )}
                </View>
            )}
            <Text
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-black dark:text-darkText"
                key="month-label">
                {month}
            </Text>
            <Graph dailySummary={dailySummary} isDark={isDark} font={font} />
        </View>
    );
}
