/**
 * React hook for age verification
 * Provides easy access to age verification functionality in React components
 */

import { useEffect, useState } from 'react';

import { AgeCategory, AgeVerificationService } from '@/modules/age-verification';

/**
 * Hook for managing age verification state
 */
export function useAgeVerification() {
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [ageCategory, setAgeCategory] = useState<AgeCategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Check availability on mount
     */
    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const available = await AgeVerificationService.isAvailable();
                setIsAvailable(available);

                // Check if already verified
                const verified = await AgeVerificationService.isVerificationComplete();
                setIsVerified(verified);

                if (verified) {
                    const category = await AgeVerificationService.getAgeCategory();
                    setAgeCategory(category);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        void checkAvailability();
    }, []);

    /**
     * Request age verification
     */
    const requestVerification = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await AgeVerificationService.requestVerification();

            if (result.isAvailable) {
                setAgeCategory(result.ageCategory);
                await AgeVerificationService.completeVerification();
                setIsVerified(true);
            }

            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Check if user meets minimum age requirement
     */
    const meetsAgeRequirement = async (minimumAge: AgeCategory): Promise<boolean> => {
        return await AgeVerificationService.enforceAgeRestriction(minimumAge);
    };

    /**
     * Check if user is a minor
     */
    const isMinor = async (): Promise<boolean> => {
        return await AgeVerificationService.isMinor();
    };

    /**
     * Check if parental consent is obtained
     */
    const hasParentalConsent = async (): Promise<boolean> => {
        return await AgeVerificationService.hasParentalConsent();
    };

    /**
     * Check if terms can be enforced (adults or minors with consent)
     */
    const canEnforceTerms = async (): Promise<boolean> => {
        return await AgeVerificationService.canEnforceTerms();
    };

    return {
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
    };
}
