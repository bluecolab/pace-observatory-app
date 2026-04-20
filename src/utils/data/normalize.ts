import { DailySummaryType } from '@/utils/data/dataUtils';

// Min-max normalize an array of numbers to [0, 1]. Ignores undefined s by returning undefined at same index.
export function normalizeArrayMinMax(values: Array<number | undefined>): {
    normalized: Array<number | undefined>;
    min: number | undefined;
    max: number | undefined;
} {
    const clean = values.filter((v): v is number => v !== undefined && !Number.isNaN(v));
    if (clean.length === 0) {
        return { normalized: values.map(() => undefined), min: undefined, max: undefined };
    }
    const min = Math.min(...clean);
    const max = Math.max(...clean);
    const range = max - min;
    if (range === 0) {
        // All values equal; return 0.5 for defined entries to render a flat midline
        return {
            normalized: values.map((v) => (v === undefined || Number.isNaN(v) ? undefined : 0.5)),
            min,
            max,
        };
    }
    return {
        normalized: values.map((v) =>
            v === undefined || Number.isNaN(v) ? undefined : (v - min) / range
        ),
        min,
        max,
    };
}

// Normalize a month's DailySummary (min/avg/max) using the overall min of mins and max of maxes.
export function normalizeDailySummary(daily: DailySummaryType[]): {
    daily: DailySummaryType[];
    min: number | undefined;
    max: number | undefined;
} {
    if (!daily || daily.length === 0) return { daily: [], min: undefined, max: undefined };

    const allMins = daily.map((d) => d.min as number | undefined);
    const allMaxs = daily.map((d) => d.max as number | undefined);
    const minVals = allMins.filter((v): v is number => v !== undefined && !Number.isNaN(v));
    const maxVals = allMaxs.filter((v): v is number => v !== undefined && !Number.isNaN(v));
    if (minVals.length === 0 || maxVals.length === 0) {
        return { daily, min: undefined, max: undefined };
    }
    const globalMin = Math.min(...minVals);
    const globalMax = Math.max(...maxVals);
    const range = globalMax - globalMin;

    const normalized = daily.map((d) => {
        const avg =
            d.avg === undefined || Number.isNaN(d.avg)
                ? undefined
                : range === 0
                  ? 0.5
                  : (d.avg - globalMin) / range;
        const min =
            d.min === undefined || Number.isNaN(d.min)
                ? undefined
                : range === 0
                  ? 0.5
                  : (d.min - globalMin) / range;
        const max =
            d.max === undefined || Number.isNaN(d.max)
                ? undefined
                : range === 0
                  ? 0.5
                  : (d.max - globalMin) / range;
        return { ...d, avg, min, max } as DailySummaryType;
    });

    return { daily: normalized, min: globalMin, max: globalMax };
}

export default function normalize() {
    return { normalizeArrayMinMax, normalizeDailySummary };
}
