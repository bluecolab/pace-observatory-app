import { router } from 'expo-router';
import { View, Image, Text, ImageSourcePropType, Pressable } from 'react-native';

const CARD_ICON_SIZE = 64;

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
            <View
                className="mr-4 shrink-0 rounded-2xl bg-lightCardBackgroundLvl1 p-3 shadow-lg dark:bg-darkCardBackgroundLvl1"
                style={{ width: CARD_ICON_SIZE + 24, height: CARD_ICON_SIZE + 24 }}>
                <Image
                    source={image}
                    className="rounded-xl"
                    style={{ width: CARD_ICON_SIZE, height: CARD_ICON_SIZE }}
                    resizeMode="contain"
                />
            </View>
            <View className="flex-1">
                <Text className="mb-1 text-lg font-bold dark:text-darkText">{title}</Text>
                <Text className="dark:text-darkTextLvl1">{description}</Text>
            </View>
        </Pressable>
    );
}
