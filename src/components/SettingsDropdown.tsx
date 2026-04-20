import { Picker } from '@react-native-picker/picker';
import React, { useRef } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

import { ModalWrapper, ModalWrapperRef } from './modals/ModalWrapper';

export default function SettingsDropdown({
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

    // iOS: Show a button, open Picker in a modal
    if (Platform.OS === 'ios') {
        return (
            <View
                style={{
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                <Text
                    style={{
                        color: isDark ? 'white' : 'black',
                        fontSize: 16,
                        flexShrink: 1,
                        marginRight: 8,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {label}
                </Text>
                <Pressable
                    onPress={() => modalRef.current?.openModal()}
                    style={{
                        backgroundColor: isDark ? '#333333' : 'white',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        minWidth: 150, // Increased width
                        maxWidth: 220, // Optional: set a max width
                    }}>
                    <Text
                        style={{
                            color: isDark ? 'white' : 'black',
                            fontSize: 16,
                            textAlign: 'right',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
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
                                onSelect(String(itemValue));
                                modalRef.current?.closeModal();
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

    // Android: Show Picker inline, label left, picker right
    return (
        <View
            style={{
                padding: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
            <Text
                style={{
                    color: isDark ? 'white' : 'black',
                    fontSize: 16,
                    flexShrink: 1,
                    marginRight: 8,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {label}
            </Text>
            <View style={{ minWidth: 150, maxWidth: 220, flex: 1 }}>
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onSelect(String(itemValue))}
                    style={{
                        backgroundColor: isDark ? '#48484A' : 'white',
                        color: isDark ? 'white' : 'black',
                        height: 60,
                        width: '100%',
                    }}>
                    {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            color={isDark ? 'black' : 'black'}
                            style={{ color: isDark ? 'white' : 'black' }}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}
