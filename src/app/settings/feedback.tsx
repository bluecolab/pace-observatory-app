import { Stack } from 'expo-router';
import React from 'react';
import { Text, ScrollView, View } from 'react-native';

import { handleLinkPress } from '@/components/LinkComp';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

interface LinkCompProps {
    url: string;
    label: string;
}

const LinkComp = ({ url, label }: LinkCompProps) => (
    <Text onPress={() => handleLinkPress(url)} className="text-blue-400 underline">
        <Text>{label}</Text>
    </Text>
);

export default function Feedback() {
    const { isDark } = useColorScheme();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Feedback',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-lightBackground dark:bg-darkBackground">
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Bugs? Problems? Suggestions?
                    </Text>

                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        We're be happy to hear from you. Please fill the form{' '}
                        <LinkComp url={'https://forms.gle/2y21wnxK3nJkbXpU6'} label={'here'} />.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}
