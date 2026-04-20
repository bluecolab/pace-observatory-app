// 10 - 10 - 2025 - Vic
// components/visualizations/WQI/PolarChartVictoryWeb.tsx
import React from 'react';
import { VictoryPie } from 'victory';

export type PolarChartProps = {
    percent: number;
    isDark: boolean;
    width?: number;
    height?: number;
    padding?: { top: number; bottom: number; left: number; right: number };
};

const getColor = (percentage: number) =>
    percentage >= 0 && percentage < 25
        ? 'darkred'
        : percentage >= 25 && percentage < 50
          ? 'darkorange'
          : percentage >= 50 && percentage < 70
            ? 'yellow'
            : percentage >= 70 && percentage < 90
              ? 'green'
              : percentage >= 90 && percentage <= 100
                ? 'darkgreen'
                : 'red'; // default

export default function PolarChartVictoryWeb({
    percent,
    isDark,
    width = 200,
    height = 200,
    padding,
}: PolarChartProps) {
    const percentage = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;

    const DATA = [
        { x: 'WQI', y: percentage },
        { x: '', y: Math.max(0, 100 - percentage) },
    ];

    const colorScale = [getColor(percentage), 'lightgray'];

    return (
        <VictoryPie
            data={DATA}
            colorScale={colorScale}
            innerRadius={60}
            startAngle={270}
            endAngle={-90}
            width={width}
            height={height}
            padding={padding}
            labels={() => null}
            style={{
                data: {
                    stroke: isDark ? '#374151' : 'white',
                    strokeWidth: 5,
                },
            }}
        />
    );
}
