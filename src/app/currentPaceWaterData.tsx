import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Platform } from 'react-native';

import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { config } from '@/hooks/useConfig';
import { extractLastData } from '@/utils/data/extractLastData';

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

export default function CurrentPaceWaterData() {
    const { isDark } = useColorScheme();
    const { waterData, loadingCurrent, waterError, refetchCurrent } = useCurrentData();
    const { defaultTemperatureUnit, showConvertedUnits } = useUserSettings();

    const lastDataPoint = extractLastData(
        waterData,
        config.BLUE_COLAB_WATER_API_CONFIG.validMatches[0],
        defaultTemperatureUnit,
        loadingCurrent,
        waterError,
        showConvertedUnits
    );

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
            {Platform.OS !== 'web' && (
                <Stack.Screen
                    options={{
                        headerTitle: 'Current Data',
                        headerStyle: {
                            backgroundColor: isDark ? '#2e2e3b' : 'white',
                        },
                        headerTintColor: isDark ? 'white' : 'black',
                        headerRight,
                    }}
                />
            )}
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
                        refreshing={loadingCurrent}
                        onRefresh={refetchCurrent}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-darkText/90">
                        Choate Pond Data
                    </Text>
                </View>

                {waterError && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-darkText/90">
                            {waterError.message}
                        </Text>
                    </View>
                )}

                <Pressable
                    onPress={() => router.push('/historicData?location=Choate Pond')}
                    className="mx-4 my-2 items-center rounded-xl p-4 dark:bg-darkCardBackground">
                    <Text className="items-center text-center text-sm dark:text-darkText">
                        Historic Choate Pond Data
                    </Text>
                </Pressable>

                {/* — The 6 Widgets — */}
                <View className="flex flex-row flex-wrap">
                    <Widget name="Water Temperature" value={lastDataPoint.temp} />
                    <Widget name="Conductivity" value={lastDataPoint.cond} />
                    <Widget name="Salinity" value={lastDataPoint.sal} />
                    <Widget name="pH" value={lastDataPoint.pH} />
                    <Widget name="Turbidity" value={lastDataPoint.turb} />
                    <Widget name="Oxygen" value={lastDataPoint.do} />
                </View>

                <View className="mb-12 mt-6 items-center px-4">
                    <WQICard loading={false} data={[]} wqi={lastDataPoint.wqi} />
                </View>
            </ScrollView>
        </>
    );
}
