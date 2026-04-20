import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { handleLinkPress } from '@/components/LinkComp';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

interface LinkCompProps {
    url: string;
    label: string;
}

// Link Component that uses Tailwind classes and dark mode
const LinkComp = ({ url, label }: LinkCompProps) => (
    <Text
        onPress={() => handleLinkPress(url)}
        className="text-blue-400 underline dark:text-blue-300">
        {label}
    </Text>
);

export default function Socials() {
    const { isDark } = useColorScheme();

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Socials',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-lightBackground dark:bg-darkBackground">
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-darkCardBackground">
                    <Text className="text-xl font-bold text-black dark:text-darkText">
                        Follow Us!
                    </Text>

                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        <LinkComp
                            url={'https://www.instagram.com/bluecolab/'}
                            label={'Instagram'}
                        />
                    </Text>
                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        <LinkComp url={'https://www.tiktok.com/@bluecolab'} label={'TikTok'} />
                    </Text>
                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        <LinkComp url={'https://bluecolab.pace.edu/'} label={'Blue CoLab Blogs'} />
                    </Text>
                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        <LinkComp url={'https://github.com/bluecolab'} label={'GitHub'} />
                    </Text>
                    <Text className="pl-3 text-lg text-black dark:text-darkText">
                        <LinkComp
                            url={'https://www.instagram.com/righttoknowh2o/'}
                            label={'Right to Know H2O Instagram!'}
                        />
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}
