import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

import { Widget, SENSOR_MAP } from '@/components/visualizations/Widget';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';

function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Refresh waterData" className="pr-4">
            <FontAwesome name="refresh" size={24} color={color} />
        </Pressable>
    );
}

function HeaderSettingsButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4">
            <FontAwesome name="gear" size={24} color={color} />
        </Pressable>
    );
}

export default function OdinData() {
    const { isDark } = useColorScheme();
    const { airData, airError, refetchCurrent } = useCurrentData();
    const { defaultTemperatureUnit } = useUserSettings();

    let odinData;
    if (airData) {
        const shouldConvertAirTemp = defaultTemperatureUnit?.trim().toLowerCase() === 'fahrenheit';
        const airTempC = airData.sensors.AirTemp;

        // Handle air temp and its potential conversion to Fahrenheit
        const displayedAirTemperature = !airTempC
            ? 'N/A'
            : shouldConvertAirTemp
              ? ((airTempC * 9) / 5 + 32).toFixed(2)
              : airTempC.toFixed(2);

        odinData = {
            sensors: {
                ...airData.sensors,
                AirTemp: displayedAirTemperature,
                humidity: airData.sensors.RelHumid?.toFixed(1) ?? 'N/A',
                windSpeed: airData.sensors.WindSpeed?.toFixed(1) ?? 'N/A',
            },
        };
    }

    const headerRight = useCallback(
        () => (
            <>
                <HeaderRefreshButton onPress={refetchCurrent} color={isDark ? 'white' : 'black'} />
                <HeaderSettingsButton
                    onPress={() => router.push('/settings')}
                    color={isDark ? 'white' : 'black'}
                />
            </>
        ),
        [refetchCurrent, isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : '#f7f7f7',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerBackTitle: 'Home',
                    headerRight,
                }}
            />
            <ScrollView className="h-full bg-lightBackground dark:bg-darkBackground">
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-darkText">
                        Odin Data
                    </Text>
                </View>

                {airError && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-darkText">
                            {airError.message}
                        </Text>
                    </View>
                )}

                <View className="flex flex-row flex-wrap">
                    {odinData && (
                        <>
                            {Object.entries({
                                ...odinData.sensors,
                            }).map(([key, value]) => {
                                // Use the map to get the correct widget name
                                const widgetName = SENSOR_MAP[key];

                                if (widgetName) {
                                    return <Widget key={key} name={widgetName} value={value} />;
                                }

                                return null;
                            })}
                        </>
                    )}
                </View>
            </ScrollView>
        </>
    );
}
