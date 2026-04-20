import AsyncStorage from '@react-native-async-storage/async-storage';

import { ColorScheme } from '@/types/colorScheme.enum';
import { UserSettingsKey } from '@/types/userSettings.enum';

export async function setStoredAppearance(value: ColorScheme) {
    try {
        await AsyncStorage.setItem(UserSettingsKey.DefaultAppearance, value);
    } catch (e) {
        console.error('Failed to store appearance:', e);
    }
}
