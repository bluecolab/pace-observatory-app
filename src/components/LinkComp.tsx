import { View, Text, Pressable, Linking } from 'react-native';

export default function LinkComp({ label, url }: { label: string; url: string }) {
    return (
        <View className="flex-row items-center space-x-2">
            <Text className="pr-2 dark:text-gray-300">•</Text>
            <Pressable onPress={() => handleLinkPress(url)}>
                <Text className="text-blue-400 underline">{label}</Text>
            </Pressable>
        </View>
    );
}

export const handleLinkPress = (url: string) => {
    void Linking.openURL(url);
};
