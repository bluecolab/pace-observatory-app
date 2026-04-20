/**
 * TypeScript interface for Age Verification Module
 * Provides type-safe access to Google Play Age Signals API
 */

import { NativeModules, Platform } from 'react-native';

/**
 * Age categories as defined by Google Play
 */
export enum AgeCategory {
    UNKNOWN = 'UNKNOWN',
    CHILD = 'CHILD', // Under 13
    TEEN = 'TEEN', // 13-17 years old
    ADULT = 'ADULT', // 18 or older
}

/**
 * Result from age verification request
 */
export interface AgeVerificationResult {
    /**
     * Age category of the user
     */
    ageCategory: AgeCategory;

    /**
     * Whether parental consent has been obtained for minor users
     */
    hasParentalConsent: boolean;

    /**
     * Whether age verification data is available from Google Play
     */
    isAvailable: boolean;

    /**
     * Additional message or information
     */
    message?: string;
}

/**
 * Result from availability check
 */
export interface AvailabilityResult {
    /**
     * Whether Age Signals API is available on this device
     */
    available: boolean;

    /**
     * Additional message or information
     */
    message?: string;
}

/**
 * Result from data deletion
 */
export interface DeletionResult {
    /**
     * Whether data was successfully deleted
     */
    deleted: boolean;

    /**
     * Additional message or information
     */
    message?: string;
}

/**
 * Native module interface
 */
interface AgeVerificationNativeModule {
    /**
     * Request age verification data from Google Play
     * Returns age category and parental consent status
     */
    requestAgeVerification(): Promise<AgeVerificationResult>;

    /**
     * Check if Age Signals API is available on this device
     */
    isAgeVerificationAvailable(): Promise<AvailabilityResult>;

    /**
     * Securely delete age verification data as required by law
     * Should be called after verification is complete
     */
    deleteAgeVerificationData(): Promise<DeletionResult>;
}

/**
 * Get the native module (Android only)
 */
const AgeVerificationNative: AgeVerificationNativeModule | null =
    Platform.OS === 'android' ? NativeModules.AgeVerification : null;

export default AgeVerificationNative;
