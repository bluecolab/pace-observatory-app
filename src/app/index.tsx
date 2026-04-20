import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { router } from 'expo-router';
import {
    Image,
    View,
    Text,
    ScrollView,
    RefreshControl,
    Pressable,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomepageCard } from '@/components/customCards/HomePageCardMini';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

function HeaderSettingsButton({
    onPress,
    color,
    style,
}: {
    onPress: () => void;
    color: string;
    style?: StyleProp<ViewStyle>;
}) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4" style={style}>
            <FontAwesome name="gear" size={24} color={color} />
        </Pressable>
    );
}

const darkLogo = require('@/assets/icons/Pace_Black_Centered.png');
const logo = require('@/assets/icons/Pace_White_KO_Centered.png');

const titleCards = [
    {
        image: require('@/assets/homescreen/waterData.png'),
        title: 'Choate Pond Water Quality',
        path: '/currentPaceWaterData',
        description:
            "Water quality measured every fifteen minutes by solar-powered underwater sensors deployed by Seidenberg School's Blue CoLab.",
    },
    {
        image: require('@/assets/homescreen/waterReport.png'),
        title: 'Pace Drinking Water Quality',
        path: '/waterReport',
        description:
            'Yearly reports on Pleasantville campus water quality published by the university in compliance with state and federal law.',
    },
    {
        image: require('@/assets/homescreen/weatherData.png'),
        title: 'Pleasantville Campus Climate',
        path: '/odinData',
        description:
            'More than 20 climate conditions measured every five minutes by the sensor-based weather station Blue CoLab built near Miller Hall.',
    },
    {
        image: require('@/assets/homescreen/aqiData.png'),
        title: 'Pleasantville Air Quality',
        path: '/airQuality',
        description:
            'Our local Air Quality Index, part of the federal AirNow program that also issues alerts when air quality threatens human health.',
    },
    {
        image: require('@/assets/homescreen/hudson.png'),
        title: 'Hudson River Monitoring',
        path: '/currentHudsonWaterData',
        description:
            'Updates on river environmental conditions aggregated by Blue CoLab from data collected USGS and partners.',
    },
];

export default function Home() {
    const { isDark } = useColorScheme();
    const { refetchCurrent, loadingCurrent } = useCurrentData();

    return (
        <SafeAreaView className="flex-1 bg-lightBackground dark:bg-darkBackground">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingCurrent}
                        onRefresh={refetchCurrent}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                <View className="relative px-4 pt-6">
                    <HeaderSettingsButton
                        onPress={() => router.push('/settings')}
                        color={isDark ? 'white' : 'black'}
                        style={{ position: 'absolute', top: 15, right: 0, zIndex: 10 }}
                    />
                    <View className="items-center">
                        <Image
                            source={isDark ? logo : darkLogo}
                            className="w-full"
                            style={{ height: 56 }}
                            resizeMode="contain"
                        />
                        <Text className="mt-2 text-center text-xl font-semibold dark:text-darkText">
                            Environmental Observatory
                        </Text>
                    </View>
                </View>

                <View className="mx-4 px-3">
                    {titleCards.map((card, index) => (
                        <HomepageCard key={index} {...card} />
                    ))}

                    <Pressable
                        onPress={() => router.push('/story')}
                        className="my-2 items-center rounded-md p-4 dark:bg-darkCardBackground">
                        <Text className="items-center text-center text-sm dark:text-darkText">
                            Click Here Learn more about Blue CoLab
                        </Text>
                    </Pressable>
                </View>

                {/* Footer text preserved */}
                <View className="py-2">
                    <Text className="text-center text-sm dark:text-darkText">
                        Gale Epstein Center
                    </Text>
                    <Text className="text-center text-sm dark:text-darkText">
                        For Technology, Policy, and the Environment
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
