import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';

// status & color logic
const getStatusAndColor = (name: string, value: number) => {
    if (isNaN(value)) return { label: 'NA', color: 'text-gray-500' };
    switch (name) {
        case 'Water Temperature':
            if (value < 77) return { label: 'Good', color: 'text-green-600' };
            else if (value < 86) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Conductivity':
            return value < 53999
                ? { label: 'Good', color: 'text-green-600' }
                : { label: 'Bad', color: 'text-red-600' };

        case 'Salinity':
            if (value < 4) return { label: 'Good', color: 'text-green-600' };
            else if (value < 9) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'pH':
            if (value < 4 || value > 11) return { label: 'Bad', color: 'text-red-600' };
            else if ((value >= 4 && value < 6) || (value > 8 && value <= 11))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Good', color: 'text-green-600' };

        case 'Turbidity':
            if (value < 24) return { label: 'Good', color: 'text-green-600' };
            else if (value < 49) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Oxygen':
            if (value >= 66 && value <= 199) return { label: 'Good', color: 'text-green-600' };
            else if ((value >= 41 && value < 66) || (value > 199 && value <= 299))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };
        case 'Sulfur Dioxide': // SO2
            if (value < 20) return { label: 'Good', color: 'text-green-600' };
            else if (value < 80) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 250) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 350) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Nitrogen Dioxide': // NO2
            if (value < 40) return { label: 'Good', color: 'text-green-600' };
            else if (value < 70) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 150) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 200) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'PM10':
            if (value < 20) return { label: 'Good', color: 'text-green-600' };
            else if (value < 50) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 100) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 200) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'PM2.5':
            if (value < 10) return { label: 'Good', color: 'text-green-600' };
            else if (value < 25) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 50) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 75) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Ozone': // O3
            if (value < 60) return { label: 'Good', color: 'text-green-600' };
            else if (value < 100) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 140) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 180) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Carbon Monoxide': // CO
            if (value < 4400) return { label: 'Good', color: 'text-green-600' };
            else if (value < 9400) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 12400) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 15400) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        default:
            return { label: '', color: 'text-gray-500' };
    }
};

// flip‐card descriptions
const DESCRIPTIONS = {
    // Water Quality
    'Water Temperature':
        'The temperature of the water, in °F or °C. Affects oxygen solubility and aquatic life metabolism.',
    Conductivity:
        'How well water conducts electricity (µS/cm). Higher values often mean more dissolved salts.',
    Salinity: 'The amount of dissolved salts in water (ppt).',
    pH: 'A measure of acidity or alkalinity on a 0-14 scale (7 is neutral). Below 7 is acidic, above 7 is alkaline.',
    Turbidity:
        'The cloudiness of water caused by suspended particles (NTU). High turbidity can harm habitats.',
    Oxygen: 'Dissolved oxygen in water (mg/L). Essential for fish and other organisms.',

    Tide: 'The rise and fall of sea levels caused by the gravitational forces of the moon and sun. (feet)',

    //Water Report
    Alkalinity:
        'Alkalinity tells you how much acid it would take to change the pH. Alkalinity acts as a buffer, neutralizing acids to prevent ph swings.',
    Barium: 'A measure of the toxicity risk of the water on a scale of 0.0- <2.0, with any number between 0.0 and 2.0 being considered the safe range.',
    Calcium:
        'Measure of calcium contained in water, measured on a scale from 0-250 with the higher the number, the *** . Calcium enters water supply when water flows over rocks such as limestone or marble.',
    Chloride: 'Chloride levels determine how salty your water tastes.',
    'Corrosivity by Calculation':
        'Corrosivity by calculation helps to show just how much saturation the water holds.',
    Fluoride:
        'Fluoride is measured in water to find a balance between its dental health benefits and the risks of overexposure.',
    Hardness:
        'Hardness reflects how much mineral content water has picked up as it passes through rock and soil.',
    Nickel: 'Nickel measurement is an important indicator of the chemical quality of source water.',
    Sodium: 'Measurement of the sodium concentration in water, high sodium levels can lead to various health problems including hypertension and kidney damage.',
    Sulfate:
        'Sulfate levels help determine not only the color of the water, but high sulfate levels can lead to dehydration amongst particular groups, as well as have a laxative adjacent effect.',
    'Total Dissolved Solids':
        'The combination  of all inorganic and organic substances dissolved in water. Measured on a scale from 50 mg/L to 1200mg/L.',
    Zinc: 'Zinc in water is essential, but elevated amounts of Zinc can be toxic to the human body.',
    'Beta particles and photon activity from man-made radionuclides':
        'High levels of beta particles and photon activity from man made radionuclides can point to nuclear or radiological contamination of water. The measurement of them helps to reveal contamination.',
    'Gross Alpha (including radium-226 but excluding radon and uranium)':
        'This is a screening that shows the naturally occurring and man made alpha emitting radionuclides present in water at significant concentrations. If levels are high precautions must be put into place to ensure the safety of drinkers.',
    'Combined radium-226 and 228':
        'Combined radium-226 and 228 is measured because it when too concentrated, the combination can lead to an increase in the risk of various bone related diseases',
    Uranium:
        'Uranium is a naturally occurring metal that is toxic to the kidneys and radiologically harmful when levels are high.',
    'Total Haloacetic Acids':
        'Halo-Acetic acids are created as a byproduct of water treatment, high traces of them can be harmful to the body.',
    'Total Trihalomethanes':
        'Chemical byproducts that are formed when disinfectants react with organic matter. Elevated levels show that the water treatment needs to be optimized.',
    'Chlorine Residual':
        'The level of active chlorine remaining in the water after treatment. Measured on a scale from 0mg/L to 5.0mg/L',
    'Distribution Turbidity':
        'Shows the cloudiness of the water as it travels through the distribution network. High levels show a poor treatment system.',
    'Perfluorooctanoic Acid (PFOA)':
        'One of the most persistent synthetic chemicals from the PFAS. Elevated levels are very dangerous as PFOA is next ot indestructible in the environment and can be harmful to consume.',
    'Perfluorooctane sulfonic Acid (PFOS)':
        'The presence of PFOS can indicate a water source having been contaminated by manufacturing,military ballistics exercises, etc.',

    // Atmospheric Conditions
    'Air Temperature': 'The ambient air temperature, measured in degrees Celsius (°C).',
    'Relative Humidity':
        'The amount of water vapor in the air, expressed as a percentage of the maximum amount the air could hold.',
    'Barometric Pressure':
        'The pressure exerted by the atmosphere, measured in hectopascals (hPa). Changes can indicate shifts in weather.',
    'Vapor Pressure':
        'The pressure exerted by water vapor in the air, measured in kilopascals (kPa).',
    'Solar Flux':
        'The amount of solar radiation energy received per unit area, measured in Watts per square meter (W/m²).',

    // Wind
    'Wind Speed':
        'The speed of air movement over the ground, measured in kilometers per hour (km/h).',
    'Max Wind Speed':
        'The highest recorded wind speed during a measurement period, in kilometers per hour (km/h).',
    'Wind Direction':
        'The direction from which the wind is blowing, measured in degrees from 0° to 360° (North is 0°).',

    // Precipitation & Events
    Rain: 'The amount of rainfall over a period, measured in millimeters (mm).',
    'Lightning Strikes': 'The total number of lightning strikes detected by the sensor.',
    'Distance to Lightning':
        'The estimated distance to the last detected lightning strike, in kilometers.',

    // Sensor Orientation
    'Tilt NS': 'The North-South tilt of the sensor in degrees.',
    'Tilt WE': 'The West-East tilt of the sensor in degrees.',
    'Carbon Monoxide':
        'Concentration of CO gas in the air, in micrograms per cubic meter (µg/m³). High concentrations reduce oxygen delivery in the body.',
    'Nitric Oxide':
        'Concentration of NO gas in the air, in micrograms per cubic meter (µg/m³). Can irritate the respiratory system at high levels.',
    'Nitrogen Dioxide':
        'Concentration of NO2 gas in the air, in micrograms per cubic meter (µg/m³). Can irritate the respiratory system at high levels.',
    Ozone: 'Concentration of O3 gas in the air, in micrograms per cubic meter (µg/m³). Can cause breathing difficulties, especially for people with asthma.',
    'Sulfur Dioxide':
        'Concentration of SO2 gas in the air, in micrograms per cubic meter (µg/m³). Can cause breathing difficulties, especially for people with asthma.',
    'PM2.5':
        'Concentration of particulate matter ≤2.5 micrometers in diameter, in micrograms per cubic meter (µg/m³). Small particles can penetrate deep into the lungs and bloodstream.',
    PM10: 'Concentration of particulate matter ≤10 micrometers in diameter, in micrograms per cubic meter (µg/m³). Small particles can penetrate deep into the lungs and bloodstream.',
    Ammonia:
        'Concentration of NH3 gas in the air, in micrograms per cubic meter (µg/m³). Can irritate the eyes, nose, and throat at high levels.',
};

// Add this map in your CurrentData.tsx file
export const SENSOR_MAP: { [key: string]: DescriptionKeys | null } = {
    AirTemp: 'Air Temperature',
    BaroPressure: 'Barometric Pressure',
    DistLightning: 'Distance to Lightning',
    LightningStrikes: 'Lightning Strikes',
    MaxWindSpeed: 'Max Wind Speed',
    Rain: 'Rain',
    RelHumid: 'Relative Humidity',
    SolarFlux: 'Solar Flux',
    TiltNS: 'Tilt NS',
    TiltWE: 'Tilt WE',
    VaporPressure: 'Vapor Pressure',
    WindDir: 'Wind Direction',
    WindSpeed: 'Wind Speed',
    // Set keys to null if you want to ignore them
    RelHumidTemp: null,
    SolarTotalFlux: null,
    co: 'Carbon Monoxide',
    no: null,
    no2: 'Nitrogen Dioxide',
    o3: 'Ozone',
    so2: 'Sulfur Dioxide',
    pm2_5: 'PM2.5',
    pm10: null,
    nh3: 'Ammonia',
};

export type DescriptionKeys = keyof typeof DESCRIPTIONS;

interface WidgetProp {
    name: DescriptionKeys;
    value: number | string;
    hideStatus?: boolean;
}

export function Widget({ name, value, hideStatus }: WidgetProp) {
    const numericValue = parseFloat(value.toString());
    const { label, color } = getStatusAndColor(name, numericValue);

    const flipCardRef = useRef<{ flip: () => void }>(null);

    const flipCard = () => flipCardRef.current?.flip();

    return (
        <View className="w-1/2 p-4">
            <Pressable
                onPress={flipCard}
                onStartShouldSetResponder={() => true} // Prevents Pressable from blocking ScrollView
            >
                {/* FRONT */}
                <FlipCard
                    flipCardRef={flipCardRef}
                    Front={
                        <View className="relative  h-[150] rounded-3xl bg-lightCardBackground p-6 dark:bg-darkCardBackground">
                            <Pressable onPress={flipCard} className="absolute right-3 top-3">
                                <FontAwesome name="info-circle" size={20} color="gray" />
                            </Pressable>

                            {/* -13px aligns water temperature with others */}
                            <Text
                                className={`text-md text-center font-bold dark:text-darkText ${
                                    name === 'Water Temperature' ? 'mt-[-13px]' : ''
                                }`}>
                                {name}
                            </Text>
                            <View className="mt-4 items-center">
                                <Text className="text-base dark:text-darkText">{value}</Text>
                                {!hideStatus && (
                                    <Text className={`text-sm italic ${color}`}>{label}</Text>
                                )}
                            </View>
                        </View>
                    }
                    Back={
                        <View className="h-[150]">
                            <ScrollView
                                className="h-full rounded-3xl bg-white p-4 dark:bg-darkCardBackground"
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                keyboardShouldPersistTaps="handled" // Ensures ScrollView handles taps
                            >
                                <Pressable onPress={flipCard}>
                                    <Text className="mb-1 text-center font-bold dark:text-darkText">
                                        {name}
                                    </Text>
                                    <Text className="text-center text-sm dark:text-darkText">
                                        {DESCRIPTIONS[name]}
                                    </Text>
                                </Pressable>
                            </ScrollView>
                        </View>
                    }
                />
            </Pressable>
        </View>
    );
}
