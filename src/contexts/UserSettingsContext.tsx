import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

import { TemperatureUnit } from '@/types/temperature.enum';
import { UserSettingsKey } from '@/types/userSettings.enum';
import { setStoredConvertedUnits } from '@/utils/storage/setStoredConvertedUnits';
import { setStoredTempUnit } from '@/utils/storage/setStoredTempUnit';

interface UserSettingsContextType {
    defaultTemperatureUnit: TemperatureUnit | undefined;
    showConvertedUnits: boolean;
    changeTemperatureUnit: (newUnit: TemperatureUnit) => void;
    changeConvertedUnits: (enabled: boolean) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType>({
    defaultTemperatureUnit: undefined,
    showConvertedUnits: false,
    changeTemperatureUnit: () => {},
    changeConvertedUnits: () => {},
});

/**
 * Context provider for temperature unit and converted units settings.
 * @param param0 Props containing children components.
 * @returns {JSX.Element} Context provider wrapping children components.
 */
export default function UserSettingsProvider({ children }: { children: React.ReactNode }) {
    const [defaultTemperatureUnit, setDefaultTemperatureUnit] = useState<TemperatureUnit>();
    const [showConvertedUnits, setShowConvertedUnits] = useState<boolean>(false);

    const changeTemperatureUnit = (newUnit: TemperatureUnit) => {
        void setStoredTempUnit(newUnit);
        setDefaultTemperatureUnit(newUnit);
    };

    const changeConvertedUnits = (enabled: boolean) => {
        void setStoredConvertedUnits(enabled);
        setShowConvertedUnits(enabled);
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [[, temperatureUnit], [, convertedUnits]] = await AsyncStorage.multiGet([
                    UserSettingsKey.DefaultTempUnit,
                    UserSettingsKey.ShowConvertedUnits,
                ]);
                if (
                    temperatureUnit === TemperatureUnit.Fahrenheit ||
                    temperatureUnit === TemperatureUnit.Celsius
                ) {
                    setDefaultTemperatureUnit(temperatureUnit as TemperatureUnit);
                } else {
                    setDefaultTemperatureUnit(TemperatureUnit.Fahrenheit);
                }
                setShowConvertedUnits(convertedUnits === 'true');
            } catch (e) {
                console.error('Failed to get user settings:', e);
            }
        };
        void loadSettings();
    }, []);

    const value = useMemo(
        () => ({
            defaultTemperatureUnit,
            showConvertedUnits,
            changeTemperatureUnit,
            changeConvertedUnits,
        }),
        [defaultTemperatureUnit, showConvertedUnits]
    );

    return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export const useUserSettings = () => useContext(UserSettingsContext);
