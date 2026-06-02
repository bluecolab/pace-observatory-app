import FontAwesome from "@react-native-vector-icons/fontawesome";
import { getMonth, getYear, getDaysInMonth } from 'date-fns';
import { Stack } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import CustomDropdown from '@/components/CustomDropdown';
import { ModalWrapper, ModalWrapperRef } from '@/components/modals/ModalWrapper';
import ComparisonCard from '@/components/visualizations/monthlyData/ComparisonCard';
import { MonthlyDataCard } from '@/components/visualizations/monthlyData/MonthlyDataCard';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import useGetGraphData from '@/hooks/useGetGraphData';
import getMetadata from '@/utils/getMetadata';

const getDaysInMonthFn = (month: number, year: number) => {
    const date = new Date(year, month - 1); // Month is 0-indexed in JavaScript
    return getDaysInMonth(date);
};

export default function HistoricData() {
    const {
        data,
        data2,
        loading,
        setYear,
        setMonth,
        setEndDay,
        setYear2,
        setMonth2,
        setEndDay2,
        defaultLocation,
        defaultTempUnit,
        selectedLocationTemp,
        selectedLocationTemp2,
        setSelectedLocationTemp,
        setSelectedLocationTemp2,
        error,
        showConvertedUnits,
        normalizeComparative,
        setNormalizeComparative,
    } = useGetGraphData();

    const { parameterInfo, units } = getMetadata();
    const { isDark } = useColorScheme();

    const locationOptions = useMemo(
        () => [
            {
                label: 'Choate Pond',
                value: '0',
            },
            {
                label: 'Piermont',
                value: '1',
            },
            {
                label: 'West Point',
                value: '2',
            },
            {
                label: 'Poughkeepsie',
                value: '3',
            },
            {
                label: 'New York City',
                value: '4',
            },
            {
                label: 'Albany',
                value: '5',
            },
            {
                label: 'Cohoes',
                value: '6',
            },
            {
                label: 'Gowanda',
                value: '7',
            },
            {
                label: 'Bronx River',
                value: '8',
            },
        ],
        []
    );

    const unitMap =
        units[
            (selectedLocationTemp ?? defaultLocation?.name ?? 'Choate Pond') as keyof typeof units
        ];

    const now = new Date();
    const currentMonth = getMonth(now) + 1; // `getMonth` is 0-indexed
    const currentYear = getYear(now);

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const [selectedMonth, setSelectedMonth] = useState(lastMonth);
    const [selectedYear, setSelectedYear] = useState(lastMonthYear);
    // Separate selection for Location 2 (defaults mirror primary)
    const [selectedMonth2, setSelectedMonth2] = useState(lastMonth);
    const [selectedYear2, setSelectedYear2] = useState(lastMonthYear);

    const { width } = Dimensions.get('window');

    const modalRef = useRef<ModalWrapperRef>(null);

    const progress = useSharedValue(0);

    const carouselRef = useRef<ICarouselInstance>(null);
    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };

    // Filters down to not show future months
    const monthOptions = React.useMemo(() => {
        const fullMonthOptions = [
            { label: 'January', value: '1' },
            { label: 'February', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'August', value: '8' },
            { label: 'September', value: '9' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
        ];
        return selectedYear === currentYear
            ? fullMonthOptions.filter((_, i) => i < currentMonth)
            : fullMonthOptions;
    }, [currentMonth, currentYear, selectedYear]);

    const monthOptions2 = React.useMemo(() => {
        const fullMonthOptions = [
            { label: 'January', value: '1' },
            { label: 'February', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'August', value: '8' },
            { label: 'September', value: '9' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
        ];
        return selectedYear2 === currentYear
            ? fullMonthOptions.filter((_, i) => i < currentMonth)
            : fullMonthOptions;
    }, [currentMonth, currentYear, selectedYear2]);

    const yearOptions = React.useMemo(() => {
        const options: { label: string; value: string }[] = [];
        for (let year = currentYear; year >= 2020; year--) {
            options.push({ label: `${year}`, value: `${year}` });
        }
        return options;
    }, [currentYear]);

    const yearOptions2 = yearOptions;

    const defaultLocationValue =
        locationOptions.find(
            (option) => option.label === (selectedLocationTemp ?? defaultLocation?.name)
        )?.value || '';

    const [selectedLocation, setSelectedLocation] = useState(defaultLocationValue);
    const [selectedLocationSecond, setSelectedLocationSecond] = useState<string>(
        selectedLocationTemp2
            ? locationOptions.find((o) => o.label === selectedLocationTemp2)?.value || ''
            : ''
    );

    const onMonthSelect = useCallback(
        (value: string) => {
            const newMonth = Number.parseInt(value, 10);
            setSelectedMonth(newMonth);
            setMonth(newMonth);
            // If selecting the current month in the current year, clamp to today's day
            const isCurrentSelection = newMonth === currentMonth && selectedYear === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(newMonth, selectedYear);
            setEndDay(endDay);
        },
        [selectedYear, setMonth, setEndDay, currentMonth, currentYear]
    );

    const onMonth2Select = useCallback(
        (value: string) => {
            const newMonth = Number.parseInt(value, 10);
            setSelectedMonth2(newMonth);
            setMonth2(newMonth);
            const isCurrentSelection = newMonth === currentMonth && selectedYear2 === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(newMonth, selectedYear2);
            setEndDay2(endDay);
        },
        [selectedYear2, setMonth2, setEndDay2, currentMonth, currentYear]
    );

    const onYearSelect = useCallback(
        (value: string) => {
            const newYear = Number.parseInt(value, 10);
            setSelectedYear(newYear);
            setYear(newYear);
            // If selecting the current month in the current year, clamp to today's day
            const isCurrentSelection = selectedMonth === currentMonth && newYear === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(selectedMonth, newYear);
            setEndDay(endDay);
        },
        [selectedMonth, setYear, setEndDay, currentMonth, currentYear]
    );

    const onYear2Select = useCallback(
        (value: string) => {
            const newYear = Number.parseInt(value, 10);
            setSelectedYear2(newYear);
            setYear2(newYear);
            const isCurrentSelection = selectedMonth2 === currentMonth && newYear === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(selectedMonth2, newYear);
            setEndDay2(endDay);
        },
        [selectedMonth2, setYear2, setEndDay2, currentMonth, currentYear]
    );

    const onLocationSelect = useCallback(
        (value: string) => {
            setSelectedLocation(value);
            const defaultLocationLabel =
                locationOptions.find((option) => option.value === value)?.label || '';
            setSelectedLocationTemp({ name: defaultLocationLabel });
        },
        [locationOptions, setSelectedLocationTemp]
    );

    const onLocation2Select = useCallback(
        (value: string) => {
            setSelectedLocationSecond(value);
            if (!value) {
                setSelectedLocationTemp2(undefined);
                return;
            }
            const label = locationOptions.find((option) => option.value === value)?.label || '';
            setSelectedLocationTemp2({ name: label });
        },
        [locationOptions, setSelectedLocationTemp2]
    );

    useEffect(() => {
        const defaultLocationValue =
            locationOptions.find(
                (option) => option.label === (selectedLocationTemp ?? defaultLocation?.name)
            )?.value || '';
        setSelectedLocation(defaultLocationValue);
        const secondValue = selectedLocationTemp2
            ? locationOptions.find((o) => o.label === selectedLocationTemp2)?.value || ''
            : '';
        setSelectedLocationSecond(secondValue);
    }, [defaultLocation, locationOptions, selectedLocationTemp, selectedLocationTemp2]);

    const HeaderRightButton = React.useCallback(
        () => (
            <Pressable onPress={() => modalRef.current?.openModal()}>
                <View>
                    <FontAwesome name="cog" size={32} color={isDark ? 'white' : '#333'} />
                </View>
            </Pressable>
        ),
        [isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Historic Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerRight: HeaderRightButton,
                    headerBackTitle: 'Back',
                }}
            />
            <View className="flex-1">
                <ScrollView className="h-full bg-lightBackground dark:bg-darkBackground">
                    <Text className="mt-5 w-[95%] self-center rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-darkCardBackground dark:text-darkText">
                        {locationOptions.find((option) => option.value === selectedLocation)?.label}{' '}
                        -{' '}
                        {
                            monthOptions.find((option) => option.value === selectedMonth.toString())
                                ?.label
                        }{' '}
                        {selectedYear}
                    </Text>

                    <Carousel
                        ref={carouselRef}
                        loop
                        width={width}
                        onProgressChange={progress}
                        height={370}
                        data={parameterInfo}
                        scrollAnimationDuration={500}
                        renderItem={({ item }) => (
                            <View style={{ width }}>
                                <MonthlyDataCard
                                    loading={loading}
                                    yAxisLabel={item.yAxisLabel}
                                    data={data}
                                    data2={data2}
                                    error={error}
                                    unit={item.unit}
                                    meta={item.meta}
                                    defaultTempUnit={defaultTempUnit}
                                    unitMap={unitMap}
                                    alternateName={item.alternateName ?? 'none'}
                                    selectedMonth={
                                        monthOptions.find(
                                            (option) => option.value === selectedMonth.toString()
                                        )?.label || 'oh no'
                                    }
                                    showConvertedUnits={showConvertedUnits}
                                    selectedLocationTemp={selectedLocationTemp}
                                    selectedLocationTemp2={selectedLocationTemp2}
                                />
                            </View>
                        )}
                        onConfigurePanGesture={(panGesture) => {
                            panGesture.activeOffsetX([-10, 10]);
                        }}
                    />

                    <Pagination.Basic
                        progress={progress}
                        data={parameterInfo}
                        dotStyle={{ backgroundColor: isDark ? '#f1f1f1' : '#262626' }}
                        activeDotStyle={{ backgroundColor: isDark ? '#444' : '#f1f1f1' }}
                        containerStyle={{ gap: 5, marginBottom: 10 }}
                        onPress={onPressPagination}
                    />

                    {(selectedLocationTemp ?? defaultLocation?.name) === 'Choate Pond' ? (
                        <WQICard data={data} loading={loading} />
                    ) : (
                        <></>
                    )}

                    <ComparisonCard
                        normalizeComparative={normalizeComparative}
                        loading={loading}
                        data={data}
                        error={error}
                        defaultTempUnit={defaultTempUnit}
                        unitMap={unitMap}
                        selectedMonth={
                            monthOptions.find((option) => option.value === selectedMonth.toString())
                                ?.label || 'oh no'
                        }
                        showConvertedUnits={showConvertedUnits}
                        selectedLocationTemp={selectedLocationTemp}
                        selectedLocationTemp2={selectedLocationTemp2}
                    />

                    <View className="pb-[45]">
                        <Text></Text>
                    </View>
                </ScrollView>

                <ModalWrapper
                    ref={modalRef}
                    modalHeight={'80%'}
                    body={
                        <>
                            <View className="absolute right-8 top-3">
                                <Pressable onPress={() => modalRef.current?.closeModal()}>
                                    <Text className="text-2xl dark:text-darkText">✕</Text>
                                </Pressable>
                            </View>

                            <View className="elevation-[20] z-10 mb-2 mt-10 w-full rounded-xl bg-gray-200 p-default dark:bg-darkCardBackground">
                                <Text className="text-center text-lg font-bold dark:text-darkText">
                                    Historic Data Settings
                                </Text>
                            </View>
                            <View className="elevation-[20] z-10 w-full rounded-xl bg-gray-200 p-default dark:bg-darkCardBackground">
                                <Text className="text-center text-lg font-bold dark:text-darkText">
                                    Location 1
                                </Text>

                                <View className="w-full flex-row space-x-4">
                                    <View className="flex-[2]">
                                        <CustomDropdown
                                            label="Month"
                                            options={monthOptions}
                                            value={selectedMonth.toString()}
                                            onSelect={onMonthSelect}
                                        />
                                    </View>
                                    <View className="flex-[2]">
                                        <CustomDropdown
                                            label="Year"
                                            options={yearOptions}
                                            value={selectedYear.toString()}
                                            onSelect={onYearSelect}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <CustomDropdown
                                        label="Location"
                                        options={locationOptions}
                                        value={selectedLocation.toString()}
                                        onSelect={onLocationSelect}
                                    />
                                </View>

                                <View className="border-b border-gray-300 dark:border-gray-600" />

                                <Text className="mt-2 text-center text-lg font-bold dark:text-darkText">
                                    Location 2
                                </Text>
                                <Text className="-mt-1 text-center text-xs text-gray-600 dark:text-gray-300">
                                    Optional: choose a second location to compare
                                </Text>
                                <View className="w-full flex-row space-x-4">
                                    <View className="flex-[2]">
                                        <CustomDropdown
                                            label="Month"
                                            options={monthOptions2}
                                            value={selectedMonth2.toString()}
                                            onSelect={onMonth2Select}
                                        />
                                    </View>
                                    <View className="flex-[2]">
                                        <CustomDropdown
                                            label="Year"
                                            options={yearOptions2}
                                            value={selectedYear2.toString()}
                                            onSelect={onYear2Select}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <CustomDropdown
                                        label="Location 2"
                                        options={[{ label: 'None', value: '' }, ...locationOptions]}
                                        value={selectedLocationSecond}
                                        onSelect={onLocation2Select}
                                    />
                                </View>

                                <View className="flex-row items-center justify-end pb-4">
                                    <Text className="mr-2 text-lg dark:text-darkText">
                                        Normalize month (0–1)
                                    </Text>
                                    <Pressable
                                        onPress={() =>
                                            setNormalizeComparative(!normalizeComparative)
                                        }
                                        style={{
                                            backgroundColor: normalizeComparative
                                                ? '#2563eb'
                                                : '#e5e7eb',
                                            borderRadius: 16,
                                            paddingVertical: 6,
                                            paddingHorizontal: 16,
                                        }}>
                                        <Text
                                            style={{
                                                color: normalizeComparative ? 'white' : 'black',
                                            }}>
                                            {normalizeComparative ? 'On' : 'Off'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    }
                />
            </View>
        </>
    );
}
