import AsyncStorage from '@react-native-async-storage/async-storage';
import { SkFont, useFont } from '@shopify/react-native-skia';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode,
} from 'react';
import { Appearance } from 'react-native';

import roboto from '@/assets/fonts/roboto.ttf';
import { ColorScheme } from '@/types/colorScheme.enum';
import { UserSettingsKey } from '@/types/userSettings.enum';
import { setStoredAppearance } from '@/utils/storage/setStoredAppearance';

interface ColorSchemeContextType {
    isDark: boolean;
    font?: SkFont | null;
    loading: boolean;
    colorSchemeSys: string;
    changeColor: (newColorScheme: ColorScheme) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType>({
    isDark: false,
    font: null,
    loading: true,
    colorSchemeSys: 'system',
    changeColor: () => {},
});

export default function ColorSchemeProvider({ children }: { children: ReactNode }) {
    const { setColorScheme } = useNativeWindColorScheme();
    const [isDark, setIsDark] = useState<boolean>(Appearance.getColorScheme() === 'dark');
    const [colorSchemeSys, setColorSchemeSys] = useState<ColorScheme>(ColorScheme.system);
    const [loading, setLoading] = useState<boolean>(true);

    const font = useFont(roboto, 12);

    // Change color scheme and persist
    const changeColor = useCallback(
        (newColorScheme: ColorScheme) => {
            void setStoredAppearance(newColorScheme);
            setColorSchemeSys(newColorScheme);
            setIsDark(
                newColorScheme === ColorScheme.system
                    ? Appearance.getColorScheme() === 'dark'
                    : newColorScheme === ColorScheme.dark
            );
            setColorScheme(newColorScheme);
        },
        [setColorScheme]
    );

    useEffect(() => {
        let isMounted = true;

        async function getStoredAppearance(): Promise<ColorScheme | null> {
            try {
                const value = await AsyncStorage.getItem(UserSettingsKey.DefaultAppearance);
                return value as ColorScheme | null;
            } catch (e) {
                console.error('Failed to get stored appearance:', e);
                return null;
            }
        }

        // Load stored appearance on mount
        void (async () => {
            const stored = await getStoredAppearance();
            if (!isMounted) return;
            if (stored) {
                setColorSchemeSys(stored);
                setIsDark(
                    stored === ColorScheme.system
                        ? Appearance.getColorScheme() === 'dark'
                        : stored === ColorScheme.dark
                );
                setColorScheme(stored);
            } else {
                setColorSchemeSys(ColorScheme.system);
                setIsDark(Appearance.getColorScheme() === 'dark');
            }
            setLoading(!font);
        })();

        // Listen for system appearance changes
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorSchemeSys === ColorScheme.system) setIsDark(colorScheme === 'dark');
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };
    }, [colorSchemeSys, font, setColorScheme]);

    // Memoize context value for performance
    const contextValue = useMemo(
        () => ({
            isDark,
            font,
            loading,
            colorSchemeSys,
            changeColor,
        }),
        [isDark, font, loading, colorSchemeSys, changeColor]
    );

    return (
        <ColorSchemeContext.Provider value={contextValue}>{children}</ColorSchemeContext.Provider>
    );
}

export const useColorScheme = () => useContext(ColorSchemeContext);
