// app/(tabs)/home/waterReport.tsx

import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Modal } from 'react-native';

import WaterSourceModal from '@/components/modals/WaterSourceModal';
import WaterReportAPI from '@/components/WaterReportAPI';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Refresh waterData" className="pr-4">
            <FontAwesome name="refresh" size={24} color={color} />
        </Pressable>
    );
}

function HeaderSettingsButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4">
            <FontAwesome name="gear" size={24} color={color} />
        </Pressable>
    );
}

interface WaterReport {
    id: string;
    year: string;
    title: string;
    uri: string;
}

const WaterReport = () => {
    const { isDark } = useColorScheme();
    const [modelOpen, setModelOpen] = useState(false);

    const waterReports: WaterReport[] = [
        {
            id: '2024',
            year: '2024',
            title: 'Annual Water Quality Report for 2024',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2024.pdf',
        },
        {
            id: '2023',
            year: '2023',
            title: 'Annual Water Quality Report for 2023',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2023.pdf',
        },
        {
            id: '2022',
            year: '2022',
            title: 'Annual Water Quality Report for 2022',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2022.pdf',
        },
        {
            id: '2021',
            year: '2021',
            title: 'Annual Water Quality Report for 2021',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2021.pdf',
        },
        {
            id: '2020',
            year: '2020',
            title: 'Annual Water Quality Report for 2020',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2020.pdf',
        },
        {
            id: '2019',
            year: '2019',
            title: 'Annual Water Quality Report for 2019',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2019.pdf',
        },
        {
            id: '2018',
            year: '2018',
            title: 'Annual Water Quality Report for 2018',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2018.pdf',
        },
        {
            id: '2017',
            year: '2017',
            title: 'Annual Water Quality Report for 2017',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2017.pdf',
        },
    ];

    const [selectedReport, setSelectedReport] = useState<WaterReport | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleReportPress = (report: WaterReport) => {
        setSelectedReport(report);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedReport(null);
    };

    const renderReportItem = ({ item, index }: { item: WaterReport; index: number }) => {
        const latestCard = index === 0;

        return (
            <Pressable
                onPress={() => handleReportPress(item)}
                className={`mb-4 flex-row items-center rounded-xl p-4 shadow ${latestCard ? 'border-2 border-[#7CB9E8] bg-[#E3F2FD] dark:bg-[#4A6D7C]' : 'bg-lightCardBackground dark:bg-darkCardBackground '}`}>
                <View className="mr-4 h-24 w-20 items-center justify-center">
                    <View className="h-full w-full items-center justify-center rounded-lg bg-[#B3D9E8] dark:bg-darkCardBackgroundLvl1">
                        <Text className="text-4xl">📄</Text>
                    </View>
                </View>

                <View className="flex-1">
                    <View className="mb-1 flex-row items-center">
                        <Text className="mr-2 text-xl font-bold text-[#1976D2] dark:text-darkText">
                            {item.year}
                        </Text>
                        {latestCard && (
                            <Text className="rounded bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
                                LATEST
                            </Text>
                        )}
                    </View>

                    <Text className="text-base leading-6 text-gray-700 dark:text-darkText">
                        {item.title}
                    </Text>
                </View>
            </Pressable>
        );
    };

    const headerRight = useCallback(
        () => (
            <>
                <HeaderRefreshButton onPress={() => {}} color={isDark ? 'white' : 'black'} />
                <HeaderSettingsButton
                    onPress={() => router.push('/settings')}
                    color={isDark ? 'white' : 'black'}
                />
            </>
        ),
        [isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Water Report',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : '#f7f7f7',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerRight,
                    headerBackTitle: 'Home',
                }}
            />

            <View className="w-full flex-1 bg-lightBackground dark:bg-darkBackground">
                <Text className=" my-5 text-center text-2xl font-bold text-gray-800 dark:text-darkText">
                    Annual Water Quality Reports
                </Text>
                <Text
                    className="mx-4 mb-5 rounded-xl bg-lightCardBackground p-4 px-6 text-center text-2xl font-bold shadow-lg dark:bg-darkCardBackground dark:text-darkText"
                    onPress={() => setModelOpen(true)}>
                    Where does our water come from?
                </Text>

                <FlatList
                    data={waterReports}
                    renderItem={renderReportItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={true}
                />
            </View>

            <WaterSourceModal visible={modelOpen} onClose={() => setModelOpen(false)} />

            {/* PDF Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                presentationStyle="fullScreen">
                <View className="flex-1 bg-neutral-300 dark:bg-darkBackground">
                    <View className="flex-row items-center justify-between bg-white px-4 py-4 dark:bg-darkCardBackground ">
                        <Text
                            numberOfLines={1}
                            className="flex-1g mr-4 text-xl font-bold text-gray-800 dark:text-darkText">
                            {selectedReport?.title}
                        </Text>

                        <Pressable
                            onPress={closeModal}
                            className=" h-10 w-10 items-center justify-center rounded-full ">
                            <Text className="text-2xl font-bold dark:text-darkText">✕</Text>
                        </Pressable>
                    </View>

                    {selectedReport && (
                        <WaterReportAPI year={selectedReport.year} uri={selectedReport.uri} />
                    )}
                </View>
            </Modal>
        </>
    );
};

export default WaterReport;
