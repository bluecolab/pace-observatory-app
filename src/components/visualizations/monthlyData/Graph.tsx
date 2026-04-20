import type { SkFont } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { AreaRange, CartesianChart, Line } from 'victory-native';

import { DailySummaryType } from '@/utils/data/dataUtils';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

interface GraphProps {
    dailySummary: DailySummaryType[];
    isDark: boolean;
    font?: SkFont | null;
}

const Graph = ({ dailySummary, isDark, font }: GraphProps) => {
    const showSecondSet = useMemo(
        () =>
            dailySummary.some(
                ({ avg2, min2, max2 }) =>
                    avg2 !== undefined || min2 !== undefined || max2 !== undefined
            ),
        [dailySummary]
    );

    const yKeys = useMemo(
        () =>
            (showSecondSet
                ? ['avg', 'min', 'max', 'avg2', 'min2', 'max2']
                : ['avg', 'min', 'max']) as Array<'avg' | 'min' | 'max' | 'avg2' | 'min2' | 'max2'>,
        [showSecondSet]
    );

    if (!font || dailySummary.length === 0) {
        return null;
    }

    return (
        <CartesianChart
            data={dailySummary}
            xKey="day"
            yKeys={yKeys}
            xAxis={{
                font,
                tickCount: 5,
                lineWidth: 0,
                formatXLabel: (label: number | string) => {
                    const numericLabel =
                        typeof label === 'number' ? label : Number.parseInt(label, 10);
                    return Number.isNaN(numericLabel) ? `${label}` : getOrdinalSuffix(numericLabel);
                },
                labelColor: isDark ? 'white' : '#000000',
            }}
            yAxis={[
                {
                    labelColor: isDark ? 'white' : '#000000',
                    font,
                },
            ]}
            frame={{
                lineColor: isDark ? 'white' : '#000000',
                lineWidth: { top: 0, bottom: 4, left: 4, right: 0 },
            }}
            padding={{ left: 0, bottom: 20, top: 5, right: 5 }}>
            {({ points }) => (
                <>
                    {points.max && points.min && (
                        <AreaRange
                            upperPoints={points.max}
                            lowerPoints={points.min}
                            color={isDark ? 'rgba(73, 146, 255, 0.95)' : 'rgba(0, 100, 255, 0.4)'}
                            animate={{ type: 'timing' }}
                        />
                    )}
                    {points.avg && (
                        <Line
                            points={points.avg}
                            color="#2563eb" // blue-600
                            strokeWidth={2}
                            animate={{ type: 'timing' }}
                        />
                    )}
                    {showSecondSet && points.max2 && points.min2 && (
                        <>
                            <AreaRange
                                upperPoints={points.max2}
                                lowerPoints={points.min2}
                                color={isDark ? 'rgba(255,165,0,0.9)' : 'rgba(255,165,0,0.35)'}
                                animate={{ type: 'timing' }}
                            />
                            {points.avg2 && (
                                <Line
                                    points={points.avg2}
                                    color="#f59e0b" // amber-500
                                    strokeWidth={2}
                                    animate={{ type: 'timing' }}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </CartesianChart>
    );
};

export default Graph;
