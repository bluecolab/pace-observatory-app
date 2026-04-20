import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';

import CustomDropdown from '@/components/CustomDropdown';
import { Widget } from '@/components/visualizations/Widget';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import useGetClosestStation from '@/hooks/useClosestStation';
import { config } from '@/hooks/useConfig';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/location.type';
import { extractLastData } from '@/utils/data/extractLastData';
import getMetadata from '@/utils/getMetadata';

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

export default function CurrentHudsonWaterData() {
    const { isDark } = useColorScheme();
    const { defaultTemperatureUnit, showConvertedUnits } = useUserSettings();
    const { locationOptions } = getMetadata();
    const { fetchWaterData } = useGetWaterData();

    const closestStation = useGetClosestStation();

    const filteredLocationOptions = useMemo(() => {
        return !closestStation.closestStation ? locationOptions.slice(1) : locationOptions;
    }, [closestStation.closestStation, locationOptions]);

    const [selectedLocationLocalValue, setSelectedLocationLocalValue] = useState<string>(
        filteredLocationOptions[0].value
    );
    const [selectedLocationLocalLabel, setSelectedLocationLocalLabel] = useState<string>(
        filteredLocationOptions[0].label
    );

    const onLocationSelect = useCallback(
        (value: string) => {
            const defaultLocationValue =
                filteredLocationOptions.find((option) => option.value === value)?.value || '';
            setSelectedLocationLocalValue(defaultLocationValue);
            setSelectedLocationLocalLabel(
                filteredLocationOptions.find((option) => option.value === value)?.label || ''
            );
        },
        [filteredLocationOptions, setSelectedLocationLocalValue]
    );

    const [waterData, setWaterData] = useState<any>(null);

    const valid = config.USGS_WATER_SERVICES_API_CONFIG.validMatches;
    const location = useMemo(() => {
        return selectedLocationLocalLabel === 'Nearest Station' && closestStation.closestStation
            ? closestStation.closestStation
            : valid.find((loc) => loc.name === selectedLocationLocalLabel);
    }, [selectedLocationLocalLabel, closestStation.closestStation, valid]);

    useEffect(() => {
        if (!location) return;
        async function fetchData() {
            const data = await fetchWaterData(location as LocationType, true, 0, 0, 0, 0);
            setWaterData(data);
        }
        void fetchData();
    }, [location, fetchWaterData]);

    const lastDataPoint = extractLastData(
        waterData,
        selectedLocationLocalLabel === 'Nearest Station'
            ? closestStation.closestStation
            : config.USGS_WATER_SERVICES_API_CONFIG.validMatches.find(
                  (loc) => loc.name === selectedLocationLocalLabel
              ),
        defaultTemperatureUnit,
        false,
        null,
        showConvertedUnits
    );
    const headerRight = useCallback(
        () => (
            <>
                <HeaderRefreshButton onPress={() => {}} color={isDark ? 'white' : 'black'} />
                <HeaderSettingsButton
                    onPress={() => router.push('/settings')}
                    color={isDark ? 'white' : 'black'}
                />
            </>
        ),
        [isDark]
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
                    headerRight,
                    headerBackTitle: 'Home',
                }}
            />
            <ScrollView
                className="h-full bg-lightBackground dark:bg-darkBackground"
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {}}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-darkText">
                        {location?.name ?? 'Loading...'}
                    </Text>
                </View>

                <View>
                    <Text className="mt-7 text-center text-xl font-bold dark:text-darkText">
                        Try other locations!
                    </Text>
                </View>
                {/* {waterError && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-darkText">
                            {waterError.message}
                        </Text>
                    </View>
                )} */}
                <View>
                    <CustomDropdown
                        label="Location"
                        options={filteredLocationOptions}
                        value={selectedLocationLocalValue}
                        onSelect={onLocationSelect}
                    />
                </View>

                <Pressable
                    onPress={() => router.push(`/historicData?location=${location?.name}`)}
                    className="mx-4 my-2 items-center rounded-xl p-4 dark:bg-darkCardBackground">
                    <Text className="items-center text-center text-sm dark:text-darkText">
                        Historic {location?.name} Pond Data
                    </Text>
                </Pressable>

                <View className="flex flex-row flex-wrap">
                    <Widget name="Water Temperature" value={lastDataPoint.temp} hideStatus />
                    <Widget name="Conductivity" value={lastDataPoint.cond} hideStatus />
                    <Widget name="Salinity" value={lastDataPoint.sal} hideStatus />
                    <Widget name="pH" value={lastDataPoint.pH} hideStatus />
                    <Widget name="Turbidity" value={lastDataPoint.turb} hideStatus />
                    <Widget name="Oxygen" value={lastDataPoint.do} hideStatus />
                    <Widget name="Tide" value={lastDataPoint.tide} hideStatus />
                </View>
            </ScrollView>
        </>
    );
}
