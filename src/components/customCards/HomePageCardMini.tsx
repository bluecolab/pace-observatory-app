import { router } from 'expo-router';
import { View, Image, Text, ImageSourcePropType, Pressable } from 'react-native';

export function HomepageCard({
    image,
    title,
    description,
    path,
}: {
    image: ImageSourcePropType;
    title: string;
    description: string;
    path: string;
}) {
    return (
        <Pressable
            onPress={() => router.push(path as any)}
            className="my-2 flex-row items-center rounded-xl bg-lightCardBackground p-4 dark:bg-darkCardBackground">
            <View className="mr-4 rounded-2xl bg-lightCardBackgroundLvl1 p-3  shadow-lg dark:bg-darkCardBackgroundLvl1">
                <Image source={image} className="h-16 w-16 rounded-xl" resizeMode="contain" />
            </View>
            <View className="flex-1">
                <Text className="mb-1 text-lg font-bold dark:text-darkText">{title}</Text>
                <Text className="dark:text-darkTextLvl1">{description}</Text>
            </View>
        </Pressable>
    );
}
