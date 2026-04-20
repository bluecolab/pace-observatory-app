/**
 * Age Verification Module
 * Google Play Age Signals API integration for compliance with state regulations
 */

export { default as AgeVerificationNative } from './AgeVerificationNative';
export { default as AgeVerificationService } from './AgeVerificationService';
export { AgeCategory } from './AgeVerificationNative';
export type {
    AgeVerificationResult,
    AvailabilityResult,
    DeletionResult,
} from './AgeVerificationNative';
