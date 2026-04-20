import { Picker } from '@react-native-picker/picker';
import { useRef } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

import { ModalWrapper, ModalWrapperRef } from './modals/ModalWrapper';

export default function CustomDropdown({
    label,
    options,
    value,
    onSelect,
}: {
    label: string;
    options: { label: string; value: string }[];
    value: string | number;
    onSelect: (value: string) => void;
}) {
    const { isDark } = useColorScheme();
    const modalRef = useRef<ModalWrapperRef>(null);

    if (Platform.OS === 'ios') {
        return (
            <View style={{ padding: 16 }}>
                <Pressable
                    onPress={() => modalRef.current?.openModal()}
                    style={{
                        backgroundColor: isDark ? '#333333' : 'white',
                        padding: 12,
                        borderRadius: 8,
                    }}>
                    <Text style={{ color: isDark ? 'white' : 'black' }}>
                        {options.find((o) => o.value === value)?.label || label}
                    </Text>
                </Pressable>
                <ModalWrapper
                    ref={modalRef}
                    modalHeight={'40%'}
                    body={
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                                modalRef.current?.closeModal();
                                onSelect(String(itemValue));
                            }}
                            style={{
                                color: isDark ? 'white' : 'black',
                            }}>
                            {options.map((option) => (
                                <Picker.Item
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                    color={isDark ? 'white' : 'black'}
                                />
                            ))}
                        </Picker>
                    }
                />
            </View>
        );
    }

    // Android: regular Picker
    return (
        <View style={{ padding: 16 }}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onSelect(String(itemValue))}
                style={{
                    backgroundColor: isDark ? '#48484A' : 'white',
                    color: isDark ? 'white' : 'black',
                    height: 50,
                }}>
                {options.map((option) => (
                    <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        color={isDark ? 'black' : 'black'}
                    />
                ))}
            </Picker>
        </View>
    );
}
