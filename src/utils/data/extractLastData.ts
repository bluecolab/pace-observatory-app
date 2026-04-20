import { config } from '@/hooks/useConfig';
import { LocationType } from '@/types/location.type';
import { CleanedWaterData, CurrentData } from '@/types/water.interface';
import dataUtils from '@/utils/data/dataUtils';
import getMetadata from '@/utils/getMetadata';

// Conversion helpers
function uscmToPpt(uscm: number): number {
    // µS/cm to ppt: multiply by 0.00055
    return uscm * 0.00055;
}
function fnuToNtu(fnu: number): number {
    // FNU to NTU: 1:1 for most practical purposes
    return fnu;
}
function psuToPpt(psu: number): number {
    // PSU to ppt: 1:1 for Hudson
    return psu;
}

const currentDataErrorObject: CurrentData = {
    timestamp: 'Loading...',
    cond: 'N/A',
    condUnit: '',
    do: 'N/A',
    doUnit: '',
    pH: 'NA',
    temp: 'N/A',
    tempUnit: '',
    turb: 'N/A',
    turbUnit: '',
    sal: 'N/A',
    salUnit: '',
    tide: 'N/A',
    tideUnit: '',
    wqi: 'N/A',
};

export function extractLastData(
    data: CleanedWaterData[] | undefined,
    defaultLocation: LocationType | undefined,
    defaultTempUnit: string | undefined,
    loading: boolean,
    error: Error | null,
    showConvertedUnits?: boolean
): CurrentData {
    const { units } = getMetadata();
    const { calculateWQI } = dataUtils();

    if (
        (defaultLocation && !Object.prototype.hasOwnProperty.call(units, defaultLocation.name)) ||
        !defaultLocation ||
        error
    ) {
        return currentDataErrorObject;
    }

    const unitMap = units[defaultLocation.name as keyof typeof units];

    if (!data || data.length < 1 || loading) {
        return currentDataErrorObject;
    }

    const sorted = [...data].filter(Boolean).sort((a, b) => {
        const ta = Date.parse(a.timestamp ?? '') || 0;
        const tb = Date.parse(b.timestamp ?? '') || 0;
        return ta - tb;
    });

    let lastDOpctVal: number | undefined;
    let lastDOVal: number | undefined;
    let lastPhVal: number | undefined;
    let lastCondVal: number | undefined;
    let lastTurbVal: number | undefined;
    let lastSalVal: number | undefined;
    let lastTempVal: number | undefined;
    let lastTideVal: number | undefined;

    for (let i = sorted.length - 1; i >= 0; i--) {
        const row = sorted[i] as CleanedWaterData;
        if (
            lastDOpctVal === undefined &&
            row.DOpct !== undefined &&
            row.DOpct !== null &&
            !Number.isNaN(row.DOpct as number)
        ) {
            lastDOpctVal = row.DOpct as number;
        }
        if (
            lastDOVal === undefined &&
            row.DO !== undefined &&
            row.DO !== null &&
            !Number.isNaN(row.DO as number)
        ) {
            lastDOVal = row.DO as number;
        }
        if (
            lastPhVal === undefined &&
            row.pH !== undefined &&
            row.pH !== null &&
            !Number.isNaN(row.pH as number)
        ) {
            lastPhVal = row.pH as number;
        }
        if (
            lastCondVal === undefined &&
            row.Cond !== undefined &&
            row.Cond !== null &&
            !Number.isNaN(row.Cond as number)
        ) {
            lastCondVal = row.Cond as number;
        }
        if (
            lastTurbVal === undefined &&
            row.Turb !== undefined &&
            row.Turb !== null &&
            !Number.isNaN(row.Turb as number)
        ) {
            lastTurbVal = row.Turb as number;
        }
        if (
            lastSalVal === undefined &&
            row.Sal !== undefined &&
            row.Sal !== null &&
            !Number.isNaN(row.Sal as number)
        ) {
            lastSalVal = row.Sal as number;
        }
        if (
            lastTempVal === undefined &&
            row.Temp !== undefined &&
            row.Temp !== null &&
            !Number.isNaN(row.Temp as number)
        ) {
            lastTempVal = row.Temp as number;
        }
        if (
            lastTideVal === undefined &&
            row.Tide2 !== undefined &&
            row.Tide2 !== null &&
            !Number.isNaN(row.Tide2 as number)
        ) {
            lastTideVal = row.Tide2 as number;
        }

        // break early if we've found all values we care about
        if (
            lastDOpctVal !== undefined &&
            lastDOVal !== undefined &&
            lastPhVal !== undefined &&
            lastCondVal !== undefined &&
            lastTurbVal !== undefined &&
            lastSalVal !== undefined &&
            lastTempVal !== undefined &&
            lastTideVal !== undefined
        ) {
            break;
        }
    }

    // Uses % DO first, fallback to DO if not available
    const dissolvedOxygen =
        typeof lastDOpctVal === 'number'
            ? lastDOpctVal.toFixed(2)
            : typeof lastDOVal === 'number'
              ? lastDOVal.toFixed(2)
              : 'N/A';
    const pH = typeof lastPhVal === 'number' ? lastPhVal.toFixed(2) : 'N/A';
    let conductivity = typeof lastCondVal === 'number' ? lastCondVal.toFixed(2) : 'N/A';
    let turbidity = typeof lastTurbVal === 'number' ? lastTurbVal.toFixed(2) : 'N/A';
    let salinity = typeof lastSalVal === 'number' ? lastSalVal.toFixed(2) : 'N/A';
    let tide = typeof lastTideVal === 'number' ? lastTideVal.toFixed(2) : 'N/A';
    let condUnit = unitMap.Cond || '';
    let turbUnit = unitMap.Turb || '';
    let salUnit = unitMap.Sal || '';
    let tideUnit = 'feet';

    // Conversion logic based on the location's unit map (not hardcoded names)
    if (showConvertedUnits) {
        // Cond: µS/cm -> ppt
        if (unitMap.Cond === 'µS/cm') {
            if (lastCondVal !== undefined && lastCondVal !== null && !Number.isNaN(lastCondVal)) {
                conductivity = uscmToPpt(lastCondVal).toFixed(3);
            }
            condUnit = 'ppt';
        }
        // Turb: FNU -> NTU
        if (unitMap.Turb === 'FNU') {
            if (lastTurbVal !== undefined && lastTurbVal !== null && !Number.isNaN(lastTurbVal)) {
                turbidity = fnuToNtu(lastTurbVal).toFixed(2);
            }
            turbUnit = 'NTU';
        }
        // Sal: PSU -> ppt
        if (unitMap.Sal === 'PSU') {
            if (lastSalVal !== undefined && lastSalVal !== null && !Number.isNaN(lastSalVal)) {
                salinity = psuToPpt(lastSalVal).toFixed(2);
            }
            salUnit = 'ppt';
        }
    }

    const shouldConvertTemp = defaultTempUnit
        ? defaultTempUnit.trim().toLowerCase() === 'fahrenheit'
        : false;
    const displayedTemperature =
        lastTempVal === undefined || lastTempVal === null
            ? 'N/A'
            : shouldConvertTemp
              ? ((lastTempVal * 9) / 5 + 32).toFixed(2)
              : lastTempVal.toFixed(2);

    const waterQualityIndex: number = config.BLUE_COLAB_WATER_API_CONFIG.validMatches.some(
        (loc) => loc.name === defaultLocation.name
    )
        ? calculateWQI(
              [
                  {
                      Cond: lastCondVal ?? 0,
                      DOpct: lastDOpctVal ?? 0,
                      Sal: lastSalVal ?? 0,
                      Temp: lastTempVal ?? 0,
                      Turb: lastTurbVal ?? 0,
                      pH: lastPhVal ?? 0,
                  },
              ],
              false
          )
        : -9999;

    return {
        timestamp: sorted[sorted.length - 1].timestamp || 'Loading...',
        cond: conductivity,
        condUnit: condUnit,
        do: dissolvedOxygen,
        doUnit: unitMap.DOpct || unitMap.DO || '',
        pH: pH,
        temp: displayedTemperature,
        tempUnit: !unitMap.Temp ? '' : shouldConvertTemp ? '°F' : unitMap.Temp,
        turb: turbidity,
        turbUnit: turbUnit,
        sal: salinity,
        salUnit: salUnit,
        tide: tide,
        tideUnit: tideUnit,
        wqi: waterQualityIndex,
    };
}
