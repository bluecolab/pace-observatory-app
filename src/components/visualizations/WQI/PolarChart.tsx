// 10 - 10 - 2025 - Vic
// components/visualizations/WQI/PolarChart.tsx
import React from 'react';
import { PolarChart as VPolarChart, Pie } from 'victory-native';

type PolarChartProps = {
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

export default function PolarChart({ percent, isDark }: PolarChartProps) {
    const percentage = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;

    const DATA = [
        { value: percentage, color: getColor(percentage), label: 'WQI' },
        { value: Math.max(0, 100 - percentage), color: 'lightgray', label: 'WQI' },
    ];

    return (
        <VPolarChart data={DATA} labelKey="label" valueKey="value" colorKey="color">
            {/* innerRadius expects a number (pixels) in victory-native; using a numeric default */}
            <Pie.Chart innerRadius={60} startAngle={270}>
                {() => (
                    <Pie.Slice>
                        <Pie.SliceAngularInset
                            angularInset={{
                                angularStrokeWidth: 5,
                                angularStrokeColor: isDark ? '#374151' : 'white',
                            }}
                        />
                    </Pie.Slice>
                )}
            </Pie.Chart>
        </VPolarChart>
    );
}
