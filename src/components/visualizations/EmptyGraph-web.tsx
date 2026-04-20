import { View, Text } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

import LottieTest from './LottieLoading';

/**
 * A component that displays an empty graph with a message. If error message is "Loading...", it shows a loading animation.
 *
 * @param error - The error object containing the error message.
 * @returns {JSX.Element}
 */
export function EmptyGraph({ error }: { error: ErrorType }) {
    const { isDark, loading } = useColorScheme();

    if (loading) {
        return <></>;
    }

    const dailySummary = Array.from({ length: 30 }, (_, i) => {
        return {
            day: i + 1,
            avg: undefined,
            min: undefined,
            max: undefined,
        };
    });

    return (
        <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
            <Text className="text-center text-black dark:text-white">{error.message}</Text>
            {error.message === 'Loading...' && (
                <View className="pointer-events-none absolute inset-0 z-10 items-center justify-center">
                    <LottieTest />
                </View>
            )}
            <VictoryChart
                padding={{ left: 50, bottom: 40, top: 20, right: 20 }}
                domain={{ y: [0, 100] }}
                style={{ parent: { background: isDark ? '#374151' : '#fff' } }}>
                <VictoryAxis
                    tickFormat={getOrdinalSuffix}
                    style={{
                        axis: { stroke: isDark ? 'white' : '#000' },
                        tickLabels: { fill: isDark ? 'white' : '#000' },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    style={{
                        axis: { stroke: isDark ? 'white' : '#000' },
                        tickLabels: { fill: isDark ? 'white' : '#000' },
                    }}
                />
                <VictoryLine
                    data={dailySummary}
                    x="day"
                    y="avg"
                    style={{
                        data: { stroke: 'blue', strokeWidth: 2 },
                    }}
                    animate={{ duration: 500 }}
                />
            </VictoryChart>
        </View>
    );
}
