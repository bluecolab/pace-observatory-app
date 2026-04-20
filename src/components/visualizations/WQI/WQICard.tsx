import { useRef } from 'react';
import { View, Dimensions, Pressable } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';
import { CleanedWaterData } from '@/types/water.interface';

import { WQICardBack } from './WQICardBack';
import WQICardFront from './WQICardFront';

interface WQICardProps {
    loading: boolean;
    data: CleanedWaterData[] | undefined;
    wqi?: number | string;
    size?: number;
}

export function WQICard({ loading, data, wqi }: WQICardProps) {
    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;

    const flipCardRef = useRef<{ flip: () => void }>(null);
    const flipCard = () => flipCardRef.current?.flip();

    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Title Bar */}

                {/* Graph Container */}
                <View className="z-10 self-center">
                    <View>
                        {/* Front View - Graph */}
                        <FlipCard
                            height={300}
                            Front={
                                <Pressable onPress={flipCard}>
                                    <WQICardFront data={data} loading={loading} wqi={wqi} />
                                </Pressable>
                            }
                            Back={
                                <Pressable onPress={flipCard}>
                                    <WQICardBack flipCard={flipCard} />
                                </Pressable>
                            }
                            flipCardRef={flipCardRef}
                            frontStyles={{ marginTop: 5, width: containerWidth }}
                            backStyles={{ marginTop: 5, width: containerWidth }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
