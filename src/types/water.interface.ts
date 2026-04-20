export interface TimeSeries {
    sourceInfo: {
        siteName: string;
        siteCode: {
            value: string;
            network: string;
            agencyCode: string;
        }[];
        timeZoneInfo: {
            defaultTimeZone: {
                zoneOffset: string;
                zoneAbbreviation: string;
            };
            daylightTimeZone: {
                zoneOffset: string;
                zoneAbbreviation: string;
            };
            siteUsesDaylightTime: boolean;
        };
        geoLocation: {
            geogLocation: {
                srs: string;
                latitude: number;
                longitude: number;
            };
            localSiteXY: {
                x: string;
                y: string;
            }[];
        };
        note: [];
        siteType: [];
        siteProperty: {
            value: string;
            name: string;
        }[];
    };
    variable: {
        variableCode: {
            value: string;
            name: string;
        }[];
        variableName: string;
        variableDescription: string;
        valueType: string;
        unit: {
            unitCode: string;
        };
        note: [];
        noDataValue: number;
        variableProperty: [];
        oid: string;
    };
    values: {
        value: {
            dateTime: string;
            value: string;
        }[];
    }[];
    name: string;
}

export interface WaterServicesData {
    declaredType: string;
    globalScope: boolean;
    name: string;
    scope: string;
    typeSubstituted: boolean;
    value: {
        queryInfo: {
            queryURL: string;
            criteria: {
                locationparam: string;
                variableparam: string;
                parameter: [];
            };
            note: {
                value: string;
                title: string;
            }[];
        };
        timeSeries: TimeSeries[];
    };
}

export interface BlueCoLabData {
    timestamp: string;
    measurement: string;
    deployment_id: number;
    sensors: {
        Cond: number;
        DO: number;
        DOpct: number;
        pH: number;
        Temp: number;
        Turb: number;
        Sal: number;
    };
}

export type ParameterName =
    | 'Cond'
    | 'DO'
    | 'DOpct'
    | 'pH'
    | 'Temp'
    | 'Turb'
    | 'Sal'
    | 'Tide1'
    | 'Tide2';

export interface CleanedWaterData {
    timestamp: string;
    Cond?: number;
    DO?: number;
    DOpct?: number;
    pH?: number;
    Temp?: number;
    Turb?: number;
    Sal?: number;
    Tide1?: number;
    Tide2?: number;
}

export type SensorData = {
    Cond: number;
    DOpct: number;
    Sal: number;
    Temp: number;
    Turb: number;
    pH: number;
};

export interface CurrentData {
    timestamp: string;
    cond: number | string;
    condUnit: string;
    do: number | string;
    doUnit: string;
    pH: number | string;
    temp: number | string;
    tempUnit: string;
    turb: number | string;
    turbUnit: string;
    sal: number | string;
    salUnit: string;
    tide: number | string;
    tideUnit: string;
    wqi: number | string;
    airTemp?: number | string;
    humidity?: number | string;
    windSpeed?: number | string;
}

export type OdinData = {
    measurement: string;
    deployment_id: number;
    timestamp: string;
    sensors: {
        AirTemp: number;
        BaroPressure: number;
        DistLightning: number;
        LightningStrikes: number;
        MaxWindSpeed: number;
        Rain: number;
        RelHumid: number;
        RelHumidTemp: number;
        SolarFlux: number;
        SolarTotalFlux: number;
        TiltNS: number;
        TiltWE: number;
        VaporPressure: number;
        WindDir: number;
        WindSpeed: number;
    };
};

export type USAQIData = {
    aqi: number;
    category: string;
    dominantPollutant: string;
    pollutantAQIs: {
        pm25: number;
        pm10: number;
        o3: number;
        co: number;
        so2: number;
        no2: number;
    };
};

export type OpenWeatherAQI = {
    coord: {
        lon: number;
        lat: number;
    };
    list: [
        {
            main: {
                aqi: number;
            };
            components: {
                co: number;
                no: number;
                no2: number;
                o3: number;
                so2: number;
                pm2_5: number;
                pm10: number;
                nh3: number;
            };
            dt: number;
        },
    ];
    usAQI?: USAQIData;
};
