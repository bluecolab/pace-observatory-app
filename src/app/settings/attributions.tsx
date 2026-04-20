import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

import { handleLinkPress } from '@/components/LinkComp';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

const LinkedIn_logo_initials = require('@/assets/icons/LinkedIn_logo_initials.png');

interface LinkCompProps {
    url: string;
    label: string;
    isLinkedin?: boolean;
}
const LinkComp = ({ url, label, isLinkedin }: LinkCompProps) => (
    <Text onPress={() => handleLinkPress(url)} className="text-blue-400 underline">
        {isLinkedin && <Image source={LinkedIn_logo_initials} style={{ width: 15, height: 15 }} />}
        <Text>{label}</Text>
    </Text>
);

interface ItemProps {
    name: string;
    label: string;
    link: string;
    team: string[];
    isLinkedin: boolean;
}

const Item = ({ name, label, link, team, isLinkedin }: ItemProps) => (
    <View className="py-1">
        <Text className="pl-3 text-lg text-black dark:text-darkText">{name}</Text>
        <Text className="pl-6 text-lg text-black dark:text-darkText">
            <LinkComp url={link} label={label} isLinkedin={isLinkedin} />
        </Text>
        {team.length > 0 ? (
            <Text className="pl-6 text-lg text-black dark:text-darkText">
                Team: {team.join(', ')}
            </Text>
        ) : (
            ''
        )}
    </View>
);

export default function Attributions() {
    const { isDark } = useColorScheme();
    const TEAM = [
        {
            name: 'Alex Chen',
            label: 'in/yan-yu-chen-3474a71aa',
            linkedin: 'https://www.linkedin.com/in/yan-yu-chen-3474a71aa/',
            team: ['Blue Shield'],
        },
        {
            name: 'Nicholas Davila',
            label: 'in/nicholas--davila/',
            linkedin: 'https://www.linkedin.com/in/nicholas--davila/',
            team: ['Blue Shield'],
        },
        {
            name: 'Noor Ul Huda',
            label: 'in/noorulhuda92/',
            linkedin: 'https://www.linkedin.com/in/noorulhuda92/',
            team: ['Tic-Tac-Toe'],
        },
        {
            name: 'Lizi Imedashvilli',
            label: 'in/lizi-imedashvili-2b3a6b249/',
            linkedin: 'https://www.linkedin.com/in/lizi-imedashvili-2b3a6b249/',
            team: ['Data Divas', 'Tic-Tac-Toe', 'App Team 67'],
        },
        {
            name: 'Ty Kelley',
            label: '',
            linkedin: '',
            team: [''],
        },
        {
            name: 'Ardin Kraja',
            label: 'in/ardin-kraja-19ab61230/',
            linkedin: 'https://www.linkedin.com/in/ardin-kraja-19ab61230/',
            team: ['Blue Jelly'],
        },
        {
            name: 'Victor Lima',
            label: 'in/victor--lima',
            linkedin: 'https://www.linkedin.com/in/victor--lima',
            team: ['Data Divas'],
        },
        {
            name: 'Vansh Kanojia',
            label: 'in/vansh-kanojia/',
            linkedin: 'https://www.linkedin.com/in/vansh-kanojia/',
            team: ['App Team 67'],
        },
        {
            name: 'Meryl Mizell',
            label: 'in/meryl-mizell/',
            linkedin: 'https://www.linkedin.com/in/meryl-mizell',
            team: ['Blue Jelly'],
        },
        {
            name: 'Charles Metayer',
            label: 'in/charles-metayer-jr-9a983b267/',
            linkedin: 'https://www.linkedin.com/in/charles-metayer-jr-9a983b267/',
            team: ['Blue Shield'],
        },
        {
            name: 'Lulu Moquette',
            label: 'in/louisamoquete',
            linkedin: 'https://www.linkedin.com/in/louisamoquete/',
            team: ['Blue Jelly+'],
        },
        {
            name: 'Kenji Okura',
            label: 'in/kenji-okura/',
            linkedin: 'https://www.linkedin.com/in/kenji-okura/',
            team: ['Blue Jelly', 'Data Divas', 'Tic-Tac-Toe', 'App Team 67'],
        },
        {
            name: 'Michael Rourke',
            label: 'in/michael-rourke-532b32225/',
            linkedin: 'https://www.linkedin.com/in/michael-rourke-532b32225/',
            team: ['Blue Shield'],
        },
        {
            name: 'Erin Sorbella',
            label: 'in/erin-sorbella-40936b241',
            linkedin: 'https://www.linkedin.com/in/erin-sorbella-40936b241',
            team: ['Blue Jelly'],
        },
        {
            name: 'Ari Kotler',
            label: 'in/KoJesko/',
            linkedin: 'https://www.linkedin.com/in/KoJesko/',
            team: ['App Team 67'],
        },
        {
            name: 'Tyler Yeung',
            label: 'in/tyleryeung/',
            linkedin: 'https://www.linkedin.com/in/tyleryeung/',
            team: ['App Team 67'],
        },
        {
            name: 'Leeza Zeidan',
            label: '',
            linkedin: '',
            team: [''],
        },
    ];

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Attributions',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />

            <ScrollView className="bg-lightBackground` dark:bg-darkBackground">
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Main Sponsors:
                    </Text>

                    <View className="mb-6 mt-4 flex-row flex-wrap justify-around md:justify-between">
                        <View className="w-full items-center md:w-1/2 lg:w-1/3">
                            <View className="items-center">
                                <Image
                                    source={{
                                        uri: 'https://bluecolab.pace.edu/files/2022/02/Cronin-portrait-500-216x216.jpg',
                                    }}
                                    className="mb-2 mt-2 h-32 w-32 rounded-lg"
                                    resizeMode="cover"
                                />
                                <Text className="text-lg text-black dark:text-darkText">
                                    John Cronin
                                </Text>
                                <Text
                                    onPress={() =>
                                        handleLinkPress('https://bluecolab.pace.edu/johncronin/')
                                    }
                                    className="text-blue-400 underline">
                                    <Image
                                        source={{
                                            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0UStDAmcksopxrQAg28I5_x7Xouw77rwdFw&s',
                                        }}
                                        style={{ width: 15, height: 15 }}
                                    />
                                    <Text>John Cronin</Text>
                                </Text>
                            </View>
                        </View>
                        <View className="w-full items-center md:w-1/2 lg:w-1/3">
                            <Image
                                source={{
                                    uri: 'https://www.pace.edu/sites/default/files/styles/1_1_360x360/public/profiles/IMG_20190502_124415_208x208-1.webp?h=ca89c27b&itok=6vS0UjkD',
                                }}
                                className="mb-2 mt-2 h-32 w-32 rounded-lg"
                                resizeMode="cover"
                            />
                            <Text className="text-lg text-black dark:text-darkText">
                                Leanne Keeley
                            </Text>
                            <Text
                                onPress={() =>
                                    handleLinkPress('https://www.pace.edu/profile/leanne-keeley')
                                }
                                className="text-blue-400 underline">
                                <Image
                                    source={{
                                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0UStDAmcksopxrQAg28I5_x7Xouw77rwdFw&s',
                                    }}
                                    style={{ width: 15, height: 15 }}
                                />
                                <Text>Leanne Keeley</Text>
                            </Text>
                        </View>
                    </View>

                    <Text className="text-lg text-black dark:text-darkText">
                        Our main sponsors who made this project possible.
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Core Team:
                    </Text>
                    {TEAM.map((item, index) => {
                        return (
                            <Item
                                key={index}
                                name={item.name}
                                label={item.label}
                                link={item.linkedin}
                                team={item.team}
                                isLinkedin={true}
                            />
                        );
                    })}
                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        They are the team members who officially worked on this app.
                    </Text>
                </View>
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="mt-2 text-xl font-bold text-black dark:text-darkText">
                        Additional Mentions:
                    </Text>
                    <Text className="text-lg text-black dark:text-darkText">
                        We would like to give the following attributions:
                    </Text>

                    <Item
                        name={'Justin Brandon'}
                        label={'in/juabrandon/'}
                        link={'https://www.linkedin.com/in/juabrandon/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'George Moses'}
                        label={'in/george-m-moses/'}
                        link={'https://www.linkedin.com/in/george-m-moses/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'Ali Tejeda'}
                        label={'in/alexandra-tejeda/'}
                        link={'https://www.linkedin.com/in/alexandra-tejeda/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'Leanna Machado'}
                        label={'in/leanna-machado/'}
                        link={'https://www.linkedin.com/in/leanna-machado/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'Sasha Breygina'}
                        label={'in/sasha-breygina-831984118/'}
                        link={'https://www.linkedin.com/in/sasha-breygina-831984118/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'Jasmin Juliano'}
                        label={'in/jasmin-juliano-2001r/'}
                        link={'https://www.linkedin.com/in/jasmin-juliano-2001r/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        They provided mentorship and guidance regarding water health.
                    </Text>

                    <Text className="text-lg text-black dark:text-darkText">
                        Finally we would take a moment to thank all of supportive teams and testers
                        that worked along side us.
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Data Providers:
                    </Text>

                    <Item
                        name={'Blue CoLab for Choate Water data'}
                        label={'Blue CoLab'}
                        link={'https://bluecolab.pace.edu/'}
                        team={['Join Us!']}
                        isLinkedin={false}
                    />

                    <Item
                        name={'USGS for non-Choate Water data'}
                        label={'USGS Water Services'}
                        link={'https://waterservices.usgs.gov/'}
                        team={[]}
                        isLinkedin={false}
                    />

                    <Item
                        name={'OpenWeatherMap for AQI'}
                        label={'OpenWeatherMap'}
                        link={'https://openweathermap.org'}
                        team={[]}
                        isLinkedin={false}
                    />
                </View>
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Software packages:
                    </Text>

                    <Item
                        name="@expo/vector-icons"
                        label="Expo Vector Icons"
                        link="https://github.com/expo/vector-icons"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@react-native-async-storage/async-storage"
                        label="Async Storage"
                        link="https://github.com/react-native-async-storage/async-storage"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@react-native-picker/picker"
                        label="React Native Picker"
                        link="https://github.com/react-native-picker/picker"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@react-navigation/native"
                        label="React Navigation Native"
                        link="https://github.com/react-navigation/react-navigation"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@shopify/react-native-skia"
                        label="React Native Skia"
                        link="https://github.com/Shopify/react-native-skia"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@tanstack/react-query"
                        label="TanStack Query"
                        link="https://github.com/TanStack/query"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="axios"
                        label="Axios"
                        link="https://github.com/axios/axios"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="date-fns"
                        label="date-fns"
                        link="https://github.com/date-fns/date-fns"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo"
                        label="Expo"
                        link="https://github.com/expo/expo"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-constants"
                        label="Expo Constants"
                        link="https://github.com/expo/expo/tree/main/packages/expo-constants"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-font"
                        label="Expo Font"
                        link="https://github.com/expo/expo/tree/main/packages/expo-font"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-linear-gradient"
                        label="Expo Linear Gradient"
                        link="https://github.com/expo/expo/tree/main/packages/expo-linear-gradient"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-linking"
                        label="Expo Linking"
                        link="https://github.com/expo/expo/tree/main/packages/expo-linking"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-location"
                        label="Expo Location"
                        link="https://github.com/expo/expo/tree/main/packages/expo-location"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-network"
                        label="Expo Network"
                        link="https://github.com/expo/expo/tree/main/packages/expo-network"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-router"
                        label="Expo Router"
                        link="https://github.com/expo/router"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-splash-screen"
                        label="Expo Splash Screen"
                        link="https://github.com/expo/expo/tree/main/packages/expo-splash-screen"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-status-bar"
                        label="Expo Status Bar"
                        link="https://github.com/expo/expo/tree/main/packages/expo-status-bar"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-system-ui"
                        label="Expo System UI"
                        link="https://github.com/expo/expo/tree/main/packages/expo-system-ui"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-web-browser"
                        label="Expo Web Browser"
                        link="https://github.com/expo/expo/tree/main/packages/expo-web-browser"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="lottie-react-native"
                        label="Lottie React Native"
                        link="https://github.com/lottie-react-native/lottie-react-native"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="nativewind"
                        label="NativeWind"
                        link="https://github.com/marklawlor/nativewind"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react"
                        label="React"
                        link="https://github.com/facebook/react"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native"
                        label="React Native"
                        link="https://github.com/facebook/react-native"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-gesture-handler"
                        label="React Native Gesture Handler"
                        link="https://github.com/software-mansion/react-native-gesture-handler"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-picker-select"
                        label="React Native Picker Select"
                        link="https://github.com/lawnstarter/react-native-picker-select"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-reanimated"
                        label="React Native Reanimated"
                        link="https://github.com/software-mansion/react-native-reanimated"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-reanimated-carousel"
                        label="Reanimated Carousel"
                        link="https://github.com/dohooo/react-native-reanimated-carousel"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-safe-area-context"
                        label="Safe Area Context"
                        link="https://github.com/th3rdwave/react-native-safe-area-context"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-screens"
                        label="React Native Screens"
                        link="https://github.com/software-mansion/react-native-screens"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-webview"
                        label="React Native Webview"
                        link="https://github.com/react-native-webview/react-native-webview"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-worklets"
                        label="React Native Worklets"
                        link="https://github.com/margelo/react-native-worklets-core"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="victory-native"
                        label="Victory Native"
                        link="https://github.com/FormidableLabs/victory-native"
                        team={[]}
                        isLinkedin={false}
                    />
                </View>
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">Assets:</Text>
                    <Item
                        name="Max Okhrimenko"
                        label="Water Animation (Loading Animation)"
                        link="https://lottiefiles.com/free-animation/water-animation-bknTaRaHON"
                        team={[]}
                        isLinkedin={false}
                    />
                </View>
                <View className="pb-[90] "></View>
            </ScrollView>
        </>
    );
}
