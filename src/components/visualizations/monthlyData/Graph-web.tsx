import { VictoryChart, VictoryAxis, VictoryArea, VictoryLine } from 'victory';

import { DailySummaryType } from '@/utils/dataUtils';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

type GraphProps = {
    dailySummary: DailySummaryType[];
    isDark: boolean;
};

export default function GraphVictory({ dailySummary, isDark }: GraphProps) {
    return (
        <VictoryChart
            padding={{ left: 50, bottom: 40, top: 20, right: 20 }}
            domainPadding={{ x: 10, y: 10 }}
            style={{
                parent: {
                    background: isDark ? '#222' : '#fff',
                },
            }}>
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
            <VictoryArea
                data={dailySummary}
                x="day"
                y={(d) => d.max}
                y0={(d) => d.min}
                style={{
                    data: {
                        fill: isDark ? 'rgba(73, 146, 255, 0.95)' : 'rgba(0, 100, 255, 0.4)',
                        strokeWidth: 0,
                    },
                }}
                animate={{ duration: 500 }}
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
    );
}
