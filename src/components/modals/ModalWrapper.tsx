import { ReactNode, Ref, useCallback, useImperativeHandle, useState } from 'react';
import { Modal, Pressable, Dimensions, DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

export interface ModalWrapperRef {
    openModal: () => void;
    closeModal: () => void;
}

interface ModalWrapperProps {
    body: ReactNode;
    modalHeight: DimensionValue;
    ref: Ref<ModalWrapperRef>;
}

export function ModalWrapper({ body, modalHeight, ref }: ModalWrapperProps) {
    const { height } = Dimensions.get('window');
    const { isDark } = useColorScheme();

    const [modalOpen, setModalOpen] = useState(false);

    const backdropOpacity = useSharedValue(0);
    const modalTranslateY = useSharedValue(height);

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const modalAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: modalTranslateY.value }],
    }));

    const openModal = useCallback(() => {
        backdropOpacity.value = withTiming(1, { duration: 300 });
        modalTranslateY.value = withTiming(0, { duration: 200 });
        setModalOpen(true);
    }, [backdropOpacity, modalTranslateY]);

    const closeModal = useCallback(() => {
        backdropOpacity.value = withTiming(0, { duration: 300 });
        modalTranslateY.value = withTiming(height, { duration: 300 });
        setModalOpen(false);
    }, [backdropOpacity, height, modalTranslateY, setModalOpen]);

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    }, [openModal, closeModal]);

    return (
        <Modal transparent visible={modalOpen} animationType="none">
            <Pressable onPress={closeModal} style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        {
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        backdropAnimatedStyle,
                    ]}
                />
            </Pressable>

            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        bottom: 0,
                        height: modalHeight,
                        width: '100%',
                        backgroundColor: isDark ? '#121212' : '#f1f1f1',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                    },
                    modalAnimatedStyle,
                ]}>
                {body}
            </Animated.View>
        </Modal>
    );
}
