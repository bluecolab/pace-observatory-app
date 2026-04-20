import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

import { Widget } from '@/components/visualizations/Widget';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import useGetWaterReportsData from '@/hooks/useGetWaterReportsData';

export default function WaterReportAPI({ year, uri }: { year: string; uri: string }) {
    const { isDark } = useColorScheme();

    const { fetchWaterReportsData } = useGetWaterReportsData();

    const [waterReportsData, setWaterReportsData] = useState<any | any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        void (async () => {
            try {
                const data = await fetchWaterReportsData(year);
                if (mounted) {
                    setWaterReportsData(data ?? null);
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err?.message ?? 'Failed to fetch data');
                    setWaterReportsData(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [fetchWaterReportsData, year]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <WebView
                source={{
                    uri: `https://docs.google.com/viewer?url=${encodeURIComponent(uri)}&embedded=true`,
                }}
                style={{
                    flex: 1,
                    backgroundColor: isDark ? '#1a202c' : 'rgb(220, 220, 220)',
                }}
                startInLoadingState={true}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        );
    }

    const items = Array.isArray(waterReportsData)
        ? waterReportsData
        : waterReportsData
          ? [waterReportsData]
          : [];

    return (
        items.length > 0 && (
            <ScrollView className="dark:bg-defaultdarkbackground h-full bg-lightBackground">
                <Text className="text-center text-4xl font-bold">{year}</Text>
                <View className="flex flex-row flex-wrap">
                    {items
                        .filter(
                            (param: any) =>
                                param &&
                                param.Level_Detected !== undefined &&
                                param.Level_Detected !== null
                        )
                        .map((param: any, index: number) => (
                            <Widget
                                key={index}
                                name={param.Contaminant}
                                value={param.Level_Detected ?? ''}
                            />
                        ))}
                </View>
            </ScrollView>
        )
    );
}
