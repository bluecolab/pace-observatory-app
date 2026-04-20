import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const defaultFrontStyles: ViewStyle = {
    width: '100%',
};

const defaultBackStyles: ViewStyle = {
    width: '100%',
};

interface FlipCardProps {
    Front: React.ReactNode;
    Back: React.ReactNode;
    flipCardRef: React.Ref<{ flip: () => void }>;
    duration?: number;
    frontStyles?: ViewStyle;
    backStyles?: ViewStyle;
    height?: number;
}

/**
 * A card component that can be flipped to reveal different content on each side.
 *
 * **Usage**:
 *
 * Declare these lines and send it as the ref parameter. Call this function inside onPress or alike:
 * ```
 * const flipCardRef = useRef<{ flip: () => void }>(null);
 * const flipCard = () => flipCardRef.current?.flip();
 * ...
 * <TouchableOpacity onPress={flipCard}>
 *    ...
 * </TouchableOpacity>
 * ```
 *
 * @param Front - The front side of the card.
 * @param Back - The back side of the card.
 * @param flipCardRef - A ref to control the flip action from outside the component.
 * @param duration - The duration of the flip animation in milliseconds.
 * @param frontStyles - Custom styles for the front side of the card.
 * @param backStyles - Custom styles for the back side of the card.
 * @param height - The height of the card.
 */
export default function FlipCard({
    Front,
    Back,
    flipCardRef,
    duration = 500,
    frontStyles = defaultFrontStyles,
    backStyles = defaultBackStyles,
    height,
}: FlipCardProps) {
    const isFlipped = useSharedValue(false);
    const [flipped, setFlipped] = useState(false);

    const handlePress = () => {
        isFlipped.value = !isFlipped.value;
        setFlipped((prev) => !prev);
    };

    // Links flip ref to handlePress
    (flipCardRef as React.RefObject<{ flip: () => void }>).current = {
        flip: handlePress,
    };

    const frontCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    const backCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    return (
        <View
            style={[
                {
                    width: '100%',
                    height: height,
                    position: 'relative',
                    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
                },
            ]}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        zIndex: 1,
                        backfaceVisibility: 'hidden',
                    },
                    frontCardAnimatedStyle,
                    frontStyles,
                ]}
                pointerEvents={flipped ? 'none' : 'auto'}>
                {Front}
            </Animated.View>
            <Animated.View
                style={[
                    {
                        zIndex: 0,
                        backfaceVisibility: 'hidden',
                    },
                    backCardAnimatedStyle,
                    backStyles,
                ]}
                pointerEvents={flipped ? 'auto' : 'none'}>
                {Back}
            </Animated.View>
        </View>
    );
}
