import AsyncStorage from '@react-native-async-storage/async-storage';

import { TemperatureUnit } from '@/types/temperature.enum';
import { UserSettingsKey } from '@/types/userSettings.enum';

export async function setStoredTempUnit(value: TemperatureUnit) {
    try {
        await AsyncStorage.setItem(UserSettingsKey.DefaultTempUnit, value);
    } catch (e) {
        console.error(e);
    }
}
