const API_URL = 'https://api.purpleair.com/v1/sensors';
const API_TIMEOUT = 10000; // 10 seconds

function aqiFromPM(pm: number): number | string {
    if (isNaN(pm)) return '-';
    if (pm === undefined) return '-';
    if (pm < 0) return pm;
    if (pm > 1000) return '-';
    /*                                  AQI         RAW PM2.5
    Good                               0 - 50   |   0.0 – 12.0
    Moderate                          51 - 100  |  12.1 – 35.4
    Unhealthy for Sensitive Groups   101 – 150  |  35.5 – 55.4
    Unhealthy                        151 – 200  |  55.5 – 150.4
    Very Unhealthy                   201 – 300  |  150.5 – 250.4
    Hazardous                        301 – 400  |  250.5 – 350.4
    Hazardous                        401 – 500  |  350.5 – 500.4
    */
    if (pm > 350.5) {
        return calcAQI(pm, 500, 401, 500.4, 350.5); //Hazardous
    } else if (pm > 250.5) {
        return calcAQI(pm, 400, 301, 350.4, 250.5); //Hazardous
    } else if (pm > 150.5) {
        return calcAQI(pm, 300, 201, 250.4, 150.5); //Very Unhealthy
    } else if (pm > 55.5) {
        return calcAQI(pm, 200, 151, 150.4, 55.5); //Unhealthy
    } else if (pm > 35.5) {
        return calcAQI(pm, 150, 101, 55.4, 35.5); //Unhealthy for Sensitive Groups
    } else if (pm > 12.1) {
        return calcAQI(pm, 100, 51, 35.4, 12.1); //Moderate
    } else if (pm >= 0) {
        return calcAQI(pm, 50, 0, 12, 0); //Good
    } else {
        return '-';
    }
}

function calcAQI(Cp: number, Ih: number, Il: number, BPh: number, BPl: number) {
    let a = Ih - Il;
    let b = BPh - BPl;
    let c = Cp - BPl;
    return Math.round((a / b) * c + Il);
}

async function getSensorData(sensorId: string, API_KEY: string, _READ_KEY?: string) {
    if (!API_KEY) {
        return null;
    }

    const headers = { 'X-API-Key': API_KEY };
    const fields = [
        'name',
        'latitude',
        'longitude',
        'pm2.5_atm',
        'pm2.5_10minute',
        'humidity',
        'temperature',
        'pressure',
        'last_seen',
    ].join(',');

    const params = new URLSearchParams({ fields });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    try {
        const response = await fetch(`${API_URL}/${sensorId}?${params.toString()}`, {
            headers,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!response.ok) {
            return await response.json();
        }
        const data = await response.json();
        const sensorData = data.sensor || {};
        return sensorData;
    } catch (error) {
        console.log('Error fetching PurpleAir data:', error);
        return error;
    }
}

export async function GET() {
    const env = (globalThis as any).process?.env ?? {};
    const PURPLEAIR_API_KEY = env.PURPLEAIR_API_KEY ?? '';
    const PURPLEAIR_READ_KEY = env.PURPLEAIR_READ_KEY ?? '';
    const PURPLEAIR_SENSOR_IDS = env.PURPLEAIR_SENSOR_IDS?.split(',') || [];
    const MOCK_DATA = env.MOCK_DATA === 'true';
//     const PURPLEAIR_API_KEY = process.env.PURPLEAIR_API_KEY ?? '';
//     const PURPLEAIR_READ_KEY = process.env.PURPLEAIR_READ_KEY ?? '';
//     const PURPLEAIR_SENSOR_IDS = process.env.PURPLEAIR_SENSOR_IDS?.split(',') || [];
//     const MOCK_DATA = process.env.MOCK_DATA === 'true';

    if (MOCK_DATA) {
        return Response.json([
            {
                name: 'Mock Sensor 1',
                latitude: 0,
                longitude: 0,
                'pm2.5_atm': 0,
                stats: { 'pm2.5_10minute': 0 },
                last_seen: 0,
                usAQI: aqiFromPM(0),
                purpleAirMapEstimate: aqiFromPM(0),
                humidity: 0,
                temperature: 0,
                pressure: 0,
            },
            {
                name: 'Mock Sensor 2',
                latitude: 0,
                longitude: 0,
                'pm2.5_atm': 0,
                stats: { 'pm2.5_10minute': 0 },
                last_seen: 0,
                usAQI: aqiFromPM(0),
                purpleAirMapEstimate: aqiFromPM(0),
                humidity: 0,
                temperature: 0,
                pressure: 0,
            },
        ]);
    }

    // Only take the first two sensor IDs if more are present
    const [sensorId1, sensorId2] = PURPLEAIR_SENSOR_IDS;
    const results = [];

    if (sensorId1) {
        const res = await getSensorData(sensorId1, PURPLEAIR_API_KEY, PURPLEAIR_READ_KEY);
        const usAQI = aqiFromPM(res['pm2.5_atm']);
        const purpleAirMapEstimate = aqiFromPM(res['stats']['pm2.5_10minute']);
        results.push({ ...res, usAQI, purpleAirMapEstimate });
    }
    if (sensorId2) {
        const res = await getSensorData(sensorId2, PURPLEAIR_API_KEY, PURPLEAIR_READ_KEY);
        const usAQI = aqiFromPM(res['pm2.5_atm']);
        const purpleAirMapEstimate = aqiFromPM(res['stats']['pm2.5_10minute']);
        results.push({ ...res, usAQI, purpleAirMapEstimate });
    }

    return Response.json(results);
}
