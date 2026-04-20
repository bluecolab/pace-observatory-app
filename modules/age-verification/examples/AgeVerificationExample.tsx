/**
 * Example component demonstrating Age Verification usage
 * This shows how to integrate age verification in your app
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';

import { useAgeVerification } from '@/hooks/useAgeVerification';
import { AgeCategory } from '@/modules/age-verification';

/**
 * Example: Age Verification Screen
 * Shows how to implement age verification on app startup
 */
export function AgeVerificationExample() {
    const {
        isAvailable,
        isVerified,
        ageCategory,
        isLoading,
        error,
        requestVerification,
        meetsAgeRequirement,
        isMinor,
        hasParentalConsent,
        canEnforceTerms,
    } = useAgeVerification();

    const [canShowRestrictedContent, setCanShowRestrictedContent] = useState(false);
    const [userIsMinor, setUserIsMinor] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);

    /**
     * Request verification on component mount if not verified
     */
    useEffect(() => {
        const doVerification = async () => {
            if (!isVerified && isAvailable && !isLoading) {
                await handleVerification();
            }
        };
        void doVerification();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerified, isAvailable, isLoading]);

    /**
     * Check age restrictions after verification
     */
    useEffect(() => {
        const doCheck = async () => {
            if (isVerified) {
                await checkAgeRestrictions();
            }
        };
        void doCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerified]);

    /**
     * Handle age verification request
     */
    const handleVerification = async () => {
        try {
            const result = await requestVerification();

            if (result.isAvailable) {
                Alert.alert(
                    'Age Verified',
                    `Your age category: ${result.ageCategory}\n` +
                        `Parental consent: ${result.hasParentalConsent ? 'Yes' : 'No'}`
                );
            } else {
                Alert.alert(
                    'Age Verification Unavailable',
                    'Age verification is not available on this device or in this environment.\n\n' +
                        'Note: Age Signals API requires:\n' +
                        '- Android device with Google Play Services\n' +
                        '- App published through Google Play\n' +
                        '- Age Signals enabled in Play Console'
                );
            }
        } catch (err) {
            Alert.alert('Verification Error', 'Failed to verify age. Please try again.');
            console.error('Age verification error:', err);
        }
    };

    /**
     * Check various age restrictions
     */
    const checkAgeRestrictions = async () => {
        // Check if user can view teen+ content
        const canViewTeen = await meetsAgeRequirement(AgeCategory.TEEN);
        setCanShowRestrictedContent(canViewTeen);

        // Check if user is a minor
        const minor = await isMinor();
        setUserIsMinor(minor);

        // Check parental consent
        const consent = await hasParentalConsent();
        setHasConsent(consent);

        // Check if can enforce terms
        const canEnforce = await canEnforceTerms();
        console.log('Can enforce terms/contracts:', canEnforce);
    };

    /**
     * Example: Accessing age-restricted feature
     */
    const handleAccessRestrictedFeature = async () => {
        const canAccess = await meetsAgeRequirement(AgeCategory.ADULT);

        if (canAccess) {
            Alert.alert('Access Granted', 'You can access this adult content.');
        } else {
            Alert.alert('Access Denied', 'This content is only available for users 18 and older.');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Verifying age...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'red', marginBottom: 20 }}>Error: {error.message}</Text>
                <Button title="Retry" onPress={() => void handleVerification()} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                Age Verification Status
            </Text>

            {/* Availability Status */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    API Available: {isAvailable ? '✓ Yes' : '✗ No'}
                </Text>
                {!isAvailable && (
                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>
                        Age Signals API requires Google Play Services and Play Store distribution
                    </Text>
                )}
            </View>

            {/* Verification Status */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    Verified: {isVerified ? '✓ Yes' : '✗ No'}
                </Text>
                {isVerified && ageCategory && (
                    <Text style={{ marginTop: 5 }}>Age Category: {ageCategory}</Text>
                )}
            </View>

            {/* User Information (if verified) */}
            {isVerified && (
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        User Information:
                    </Text>
                    <Text>• Minor: {userIsMinor ? 'Yes' : 'No'}</Text>
                    {userIsMinor && <Text>• Parental Consent: {hasConsent ? 'Yes' : 'No'}</Text>}
                    <Text>• Can view teen+ content: {canShowRestrictedContent ? 'Yes' : 'No'}</Text>
                </View>
            )}

            {/* Actions */}
            <View>
                {!isVerified && (
                    <Button
                        title="Request Age Verification"
                        onPress={() => void handleVerification()}
                        disabled={!isAvailable}
                    />
                )}

                {isVerified && (
                    <>
                        <View style={{ marginBottom: 10 }}>
                            <Button
                                title="Check Access to Adult Content"
                                onPress={() => void handleAccessRestrictedFeature()}
                            />
                        </View>
                        <Button title="Re-verify Age" onPress={() => void handleVerification()} />
                    </>
                )}
            </View>

            {/* Legal Notice */}
            <View style={{ marginTop: 30, padding: 10, backgroundColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 12, color: '#666' }}>
                    Legal Notice: Age verification is required to comply with regulations in Texas,
                    Utah, and Louisiana. Your age data is only used for age-related restrictions and
                    is deleted after verification per legal requirements.
                </Text>
            </View>
        </View>
    );
}

/**
 * Example: Protected Content Component
 * Shows how to protect age-restricted content
 */
export function ProtectedContentExample() {
    const { isVerified, meetsAgeRequirement } = useAgeVerification();
    const [canView, setCanView] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            if (isVerified) {
                const allowed = await meetsAgeRequirement(AgeCategory.TEEN);
                setCanView(allowed);
            }
        };

        void checkAccess();
    }, [isVerified, meetsAgeRequirement]);

    if (!isVerified) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Please verify your age to view this content.</Text>
            </View>
        );
    }

    if (!canView) {
        return (
            <View style={{ padding: 20 }}>
                <Text>This content is only available for users 13 and older.</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Protected content goes here...</Text>
        </View>
    );
}

export default AgeVerificationExample;
