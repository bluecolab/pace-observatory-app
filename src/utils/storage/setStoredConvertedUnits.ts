import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserSettingsKey } from '@/types/userSettings.enum';

export async function setStoredConvertedUnits(value: boolean) {
    try {
        await AsyncStorage.setItem(UserSettingsKey.ShowConvertedUnits, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
}
