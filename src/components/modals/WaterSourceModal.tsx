import React from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable } from 'react-native';

interface WaterSourceModalProps {
    visible: boolean;
    onClose: () => void;
}

const WaterSourceModal: React.FC<WaterSourceModalProps> = ({ visible, onClose }) => {
    return (
        <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
            {/* Header with Title and Close Button */}
            <View className="flex-row items-center justify-between bg-[#1c2b4b] px-4 py-3 dark:bg-darkCardBackground">
                <Text className="flex-1 text-xl font-bold text-white">
                    Where your water is coming from?
                </Text>
                <Pressable onPress={onClose} className="p-1">
                    <Text className="text-2xl font-bold dark:text-darkText">✕</Text>
                </Pressable>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                className="flex-1 bg-lightBackground dark:bg-darkBackground"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}>
                {/* Animated GIF */}
                <View className="mb-2 h-[475px] rounded-lg">
                    <Image
                        source={require('@/assets/homescreen/Pace-PLV-water-animated-1.gif')}
                        className="h-full w-full rounded-3xl"
                        resizeMode="contain"
                    />
                </View>

                {/* Summarized Content */}
                <View className="m-4 rounded-lg p-4 text-lightCardBackground dark:bg-darkCardBackground">
                    <Text className="mb-2 text-2xl font-bold text-[#1c2b4b] dark:text-darkText">
                        Pace Pleasantville Drinking Water
                    </Text>
                    <Text className="mb-2 text-base text-gray-700 dark:text-darkText">
                        This guide provides an overview of our campus water sources, quality
                        regulations, and safety reports.
                    </Text>

                    <Text className="mb-1 mt-4 text-lg font-semibold text-gray-800 dark:text-darkText">
                        Where does it come from?
                    </Text>
                    <Text className="mb-2 text-base text-gray-700 dark:text-darkText">
                        <Text className="font-bold text-black dark:text-darkText">
                            Primary Source:{' '}
                        </Text>
                        Pace Pleasantville water originates 91 miles away in the{' '}
                        <Text className="font-bold text-black dark:text-darkText">
                            Ashokan Reservoir
                        </Text>{' '}
                        (Catskill Mountains). It flows through deep underground aqueducts beneath
                        the Hudson River before reaching our campus.
                    </Text>
                    <Text className="mb-2 text-base text-gray-700 dark:text-darkText">
                        <Text className="font-bold text-black dark:text-darkText">
                            Secondary Source:{' '}
                        </Text>
                        The{' '}
                        <Text className="font-bold text-black dark:text-darkText">
                            Croton Reservoir
                        </Text>
                        , located just 12 miles away, serves as a backup source during emergencies
                        or maintenance.
                    </Text>

                    <Text className="mb-1 mt-4 text-lg font-semibold text-gray-800 dark:text-darkText">
                        Safety & Compliance
                    </Text>
                    <Text className="mb-2 text-base text-gray-700 dark:text-darkText">
                        Pace operates as a classified "community water system." We strictly adhere
                        to the Federal Safe Drinking Water Act and the NY State Sanitary Code.
                    </Text>
                    <Text className="mb-2 text-base text-gray-700 dark:text-darkText">
                        Annual Water Quality Reports are issued every May 31st, detailing testing
                        results for the previous year to ensure transparency and safety.
                    </Text>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default WaterSourceModal;
