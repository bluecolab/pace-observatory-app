// app/_layout.tsx
import '../../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import ColorSchemeProvider from '@/contexts/ColorSchemeContext';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import UserSettingsProvider from '@/contexts/UserSettingsContext';
import { sendExpoPushToken } from '@/utils/supabase/sendExpoPushToken';

export const unstable_settings = {
    initialRouteName: 'index',
};

if (Device.isDevice) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const hasNotificationPermission = (
            permissions: Notifications.NotificationPermissionsStatus
        ) => {
            if (Platform.OS !== 'ios') return true;
            return (
                permissions.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
                permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
            );
        };

        const existingPermissions = await Notifications.getPermissionsAsync();
        let isGranted = hasNotificationPermission(existingPermissions);
        if (!isGranted) {
            const requestedPermissions = await Notifications.requestPermissionsAsync();
            isGranted = hasNotificationPermission(requestedPermissions);
        }
        if (!isGranted) {
            handleRegistrationError(
                'Permission not granted to get push token for push notification!'
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

/** The root layout of the app. It wraps the app in the necessary providers.
 * @returns {JSX.Element}
 */
// Initialize Query Client once (module scope to preserve across re-renders)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Avoid refetching on every screen focus unless desired
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1 minute by default; screen-level queries can override
        },
    },
});

function RootLayout() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [_notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    useEffect(() => {
        if (!expoPushToken) return;

        void (async () => {
            try {
                await sendExpoPushToken(expoPushToken);
                console.log('Expo push token synced successfully.');
            } catch (error: unknown) {
                console.error('Failed to sync Expo push token:', error);
            }
        })();
    }, [expoPushToken]);

    return (
        <QueryClientProvider client={queryClient}>
            <UserSettingsProvider>
                <CurrentDataProvider>
                    <ColorSchemeProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="settings"
                                options={{
                                    presentation: 'modal',
                                    headerShown: false,
                                }}
                            />
                        </Stack>
                    </ColorSchemeProvider>
                </CurrentDataProvider>
            </UserSettingsProvider>
        </QueryClientProvider>
    );
}

export default RootLayout;
