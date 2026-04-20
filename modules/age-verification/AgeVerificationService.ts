/**
 * Age Verification Service
 * High-level service for managing age verification via Google Play Age Signals API
 * Ensures compliance with state regulations (Texas, Utah, Louisiana)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import AgeVerificationNative, { AgeCategory, AgeVerificationResult } from './AgeVerificationNative';

/**
 * Storage keys for age verification data
 * Note: Data should be deleted after verification per legal requirements
 */
const STORAGE_KEYS = {
    AGE_CATEGORY: '@age_verification:category',
    PARENTAL_CONSENT: '@age_verification:consent',
    VERIFICATION_TIMESTAMP: '@age_verification:timestamp',
    VERIFICATION_COMPLETED: '@age_verification:completed',
};

/**
 * Age Verification Service
 * High-level service for managing age verification via Google Play Age Signals API
 * Ensures compliance with state regulations (Texas, Utah, Louisiana)
 *
 * Note: Age verification is only considered valid for up to 12 months from the time of verification,
 * in accordance with state regulations (e.g., Utah law). This service does not automatically trigger
 * re-verification when the verification expires. Consumers of this service are responsible for:
 *   - Checking `isVerificationComplete()` before relying on cached verification data.
 *   - Calling `requestVerification()` to re-verify the user's age if verification is not complete or has expired.
 */
export class AgeVerificationService {
    /**
     * Check if age verification is available on this platform/device
     */
    static async isAvailable(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return false;
        }

        if (!AgeVerificationNative) {
            return false;
        }

        try {
            const result = await AgeVerificationNative.isAgeVerificationAvailable();
            return result.available;
        } catch (error) {
            console.error('Error checking age verification availability:', error);
            return false;
        }
    }

    /**
     * Request age verification from Google Play
     * This should be called when:
     * - User first launches the app
     * - After a significant app update
     * - Periodically (max once per 12 months per Utah law)
     *
     * @returns Age verification result
     */
    static async requestVerification(): Promise<AgeVerificationResult> {
        if (Platform.OS !== 'android' || !AgeVerificationNative) {
            return {
                ageCategory: AgeCategory.UNKNOWN,
                hasParentalConsent: false,
                isAvailable: false,
                message: 'Age verification only available on Android',
            };
        }

        try {
            const result = await AgeVerificationNative.requestAgeVerification();

            // Store verification data temporarily for app session
            // This data will be deleted after verification
            await AsyncStorage.setItem(STORAGE_KEYS.AGE_CATEGORY, result.ageCategory);
            await AsyncStorage.setItem(
                STORAGE_KEYS.PARENTAL_CONSENT,
                String(result.hasParentalConsent)
            );
            await AsyncStorage.setItem(STORAGE_KEYS.VERIFICATION_TIMESTAMP, String(Date.now()));

            return result;
        } catch (error) {
            console.error('Error requesting age verification:', error);
            throw error;
        }
    }

    /**
     * Get cached age category
     * Returns null if not available or verification not completed
     */
    static async getAgeCategory(): Promise<AgeCategory | null> {
        try {
            const category = await AsyncStorage.getItem(STORAGE_KEYS.AGE_CATEGORY);
            if (category && Object.values(AgeCategory).includes(category as AgeCategory)) {
                return category as AgeCategory;
            }
            return null;
        } catch (error) {
            console.error('Error getting age category:', error);
            return null;
        }
    }

    /**
     * Check if user has parental consent (for minors)
     */
    static async hasParentalConsent(): Promise<boolean> {
        try {
            const consent = await AsyncStorage.getItem(STORAGE_KEYS.PARENTAL_CONSENT);
            return consent === 'true';
        } catch (error) {
            console.error('Error checking parental consent:', error);
            return false;
        }
    }

    /**
     * Check if user is a minor (under 18)
     */
    static async isMinor(): Promise<boolean> {
        const category = await this.getAgeCategory();
        return category === AgeCategory.CHILD || category === AgeCategory.TEEN;
    }

    /**
     * Check if verification is complete and valid
     */
    static async isVerificationComplete(): Promise<boolean> {
        try {
            const completed = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION_COMPLETED);
            const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION_TIMESTAMP);

            if (!completed || !timestamp) {
                return false;
            }

            // Check if verification is still valid (within 12 months per Utah law)
            const verificationAge = Date.now() - parseInt(timestamp, 10);
            const twelveMonthsMs = 365 * 24 * 60 * 60 * 1000;

            return verificationAge < twelveMonthsMs;
        } catch (error) {
            console.error('Error checking verification status:', error);
            return false;
        }
    }

    /**
     * Mark verification as complete
     * Should be called after verification data is processed
     */
    static async markVerificationComplete(): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.VERIFICATION_COMPLETED, 'true');
        } catch (error) {
            console.error('Error marking verification complete:', error);
        }
    }

    /**
     * Delete all age verification data
     * REQUIRED BY LAW: Must be called after verification is complete
     *
     * Per Texas/Utah/Louisiana law:
     * - Raw personal data from app store must be deleted after verification
     * - Age category may be retained only for enforcing age-related restrictions
     * - Data may only be used for age-related restrictions, compliance, and safety
     */
    static async deleteVerificationData(): Promise<void> {
        try {
            // Delete from native module (removes raw app store data)
            if (Platform.OS === 'android' && AgeVerificationNative) {
                await AgeVerificationNative.deleteAgeVerificationData();
            }

            // Delete verification timestamp (raw personal data)
            // Keep age category and parental consent for enforcement purposes as allowed by law
            await AsyncStorage.removeItem(STORAGE_KEYS.VERIFICATION_TIMESTAMP);

            console.log('Age verification data deleted successfully');
        } catch (error) {
            console.error('Error deleting verification data:', error);
            throw error;
        }
    }

    /**
     * Enforce age restrictions based on verification data
     * This method should be called before allowing access to age-restricted features
     *
     * @param minimumAge Minimum age category required (TEEN or ADULT)
     * @returns Whether user meets the minimum age requirement
     */
    static async enforceAgeRestriction(minimumAge: AgeCategory): Promise<boolean> {
        const category = await this.getAgeCategory();

        if (!category || category === AgeCategory.UNKNOWN) {
            // Age not verified - restrict access by default
            return false;
        }

        // Define age hierarchy
        const ageHierarchy = {
            [AgeCategory.UNKNOWN]: 0,
            [AgeCategory.CHILD]: 1,
            [AgeCategory.TEEN]: 2,
            [AgeCategory.ADULT]: 3,
        };

        const userAge = ageHierarchy[category];
        const requiredAge = ageHierarchy[minimumAge];

        return userAge >= requiredAge;
    }

    /**
     * Check if parental consent is required and obtained
     * For minor users, this must return true to enforce contracts/ToS per Utah law
     */
    static async canEnforceTerms(): Promise<boolean> {
        const isMinorUser = await this.isMinor();

        if (!isMinorUser) {
            // Adults don't need parental consent
            return true;
        }

        // For minors, parental consent is required
        return await this.hasParentalConsent();
    }

    /**
     * Complete verification process
     * Handles the full verification lifecycle including data deletion
     */
    static async completeVerification(): Promise<void> {
        try {
            // Mark as complete
            await this.markVerificationComplete();

            // Delete personal data as required by law
            // Keep only age category for enforcing restrictions
            await this.deleteVerificationData();
        } catch (error) {
            console.error('Error completing verification:', error);
            throw error;
        }
    }
}

export default AgeVerificationService;
