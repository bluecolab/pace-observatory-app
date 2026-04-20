// /app/(tabs)/home/story.tsx
import { Stack } from 'expo-router';
import { JSX } from 'react';
import { Text, ScrollView, Image } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

/**  This component displays the story of Blue CoLab, including its mission and approach to water contamination risks.
 * @returns {JSX.Element}
 */
export default function Story(): JSX.Element {
    const { isDark } = useColorScheme();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Our Story',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : '#f7f7f7',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-lightBackground p-5 dark:bg-darkBackground">
                {/* Title */}
                <Text className="mb-8 text-center text-2xl font-bold text-blue-800 dark:text-darkText">
                    At Seidenberg School, we believe students can make a difference today, before
                    they launch their careers of tomorrow.
                </Text>

                {/* Top Image */}
                <Image
                    source={require('@/assets/StoryScreen/Three-labs-copy.jpg')}
                    className=" mb-4 h-[100px] w-full rounded-md"
                    resizeMode="cover"
                />

                {/* Content Sections */}
                <Text className="mb-2 text-lg font-bold text-blue-800 dark:text-[#57ADBF]">
                    Is your water safe to drink?
                </Text>
                <Text className="mb-4 text-base text-blue-800 dark:text-[#57ADBF]">
                    We believe you have the right to know.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    At <Text className="font-bold">Blue CoLab</Text>, we're working to ensure you
                    have the critical information you need about your water quality. Our dedicated
                    team of students, interns, graduate assistants, faculty, and staff are advancing
                    technology, information, and warning systems to make this a reality.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    At our technology lab overlooking the Hudson River, our Choate Pond lab on
                    campus, and our data lab in the Goldstein Academic Center, Blue CoLab is
                    dedicated to the proposition that you have the{' '}
                    <Text className="font-bold">right-to-know</Text> the quality of your water
                    before you drink it, swim in it, fish it, or even swamp your canoe.
                </Text>

                {/* Section Titles */}
                <Text className="mb-2 mt-5 text-xl font-semibold text-blue-800 dark:text-[#57ADBF] ">
                    Water Contamination Risks
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    Chances are the water you use is safe, but millions have unfortunately found
                    otherwise. In a matter of hours, a single sip of pathogen-contaminated water can
                    result in serious illness. Currently, labs require 24–48 hours to report
                    analyses of samples taken weekly, or less.
                </Text>

                <Text className="mb-2 text-base text-gray-700 dark:text-darkText ">
                    • In <Text className="font-bold">Milwaukee (1993)</Text>, 400,000 residents
                    became ill and 100 died after drinking water contaminated with cryptosporidium.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    • For years, residents of <Text className="font-bold">Hoosick Falls</Text> and{' '}
                    <Text className="font-bold">Newburgh, NY</Text> may have been unknowingly
                    exposed to highly toxic PFAS.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    Water contamination is a global problem, making millions of people ill.
                    <Text> </Text>
                    <Text className="font-bold">Real-time</Text>, technological detection of water
                    contaminants is the best defense.
                </Text>

                {/* Blue CoLab's Approach */}
                <Text className="mb-2 mt-5 text-xl font-semibold text-blue-800 dark:text-[#57ADBF] ">
                    Blue CoLab's Hands-On Approach
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    Blue CoLab emphasizes a <Text className="font-bold">hands-on</Text> approach to
                    foster innovation. Students gain practical experience operating real-time
                    sensors and instruments; managing and visualizing data (including sonification);
                    and developing UX, web, GIS, and app solutions.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    They work in a <Text className="font-bold">team-based environment</Text>, using
                    Blue CoLab’s dedicated labs, instruments, equipment, and servers.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-darkText ">
                    Blue CoLab stands for everything that makes Seidenberg School a special place —
                    harnessing innovation on behalf of society, and providing students with
                    skill-based experiences that lead to a career meaningful to them, and to
                    society.
                </Text>

                {/* Closing Statement */}
                <Text className="mt-5 text-center text-lg italic text-gray-600 dark:text-darkText ">
                    <Text className="font-bold">
                        "All of us at Blue CoLab look forward to seeing you on the team."
                    </Text>
                </Text>
                <Text className="mb-20 pb-10 text-center text-lg italic text-gray-600 dark:text-darkText ">
                    — <Text className="font-bold">John Cronin, Blue CoLab Director</Text> —
                </Text>
            </ScrollView>
        </>
    );
}
