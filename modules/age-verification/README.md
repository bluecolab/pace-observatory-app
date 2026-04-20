# Google Play Age Signals API Integration

## Overview

This module implements age verification via Google Play Age Signals API to comply with state regulations in Texas, Utah, and Louisiana that require apps to:

1. Verify age categories of users
2. Obtain and verify parental consent for minors
3. Use age data only for specific purposes (age restrictions, compliance, safety)
4. Delete personal data after verification

## Legal Requirements

### Texas (HB 18)

- Verify age category for each user from app store data
- Verify parental consent for minor users
- Delete personal data after verification is complete

### Utah (HB 464)

- Verify age category and parental consent via app store data sharing
- Request verification at download, purchase, or significant app changes
- Re-verify annually (max once per 12 months)
- Use lowest age category from any source
- Cannot enforce contracts against minors without verified parental consent
- Cannot share age category data with anyone

### Louisiana

- Similar requirements to Texas

## Architecture

### Components

1. **Native Android Module** (`AgeVerificationModule.java`)

    - Interfaces with Google Play Integrity API
    - Provides low-level access to Age Signals

2. **TypeScript Native Interface** (`AgeVerificationNative.ts`)

    - Type-safe TypeScript interface to native module
    - Defines data types and contracts

3. **Service Layer** (`AgeVerificationService.ts`)

    - High-level business logic
    - Data storage and lifecycle management
    - Compliance enforcement

4. **React Hook** (`useAgeVerification.ts`)

    - Easy integration in React components
    - Manages state and side effects

5. **Expo Config Plugin** (`withAgeVerification.js`)
    - Configures Android build with required dependencies
    - Adds Google Play Services to build.gradle

## Age Categories

- **UNKNOWN**: Age category not available
- **CHILD**: User is under 13 years old
- **TEEN**: User is 13-17 years old
- **ADULT**: User is 18 or older

## Usage

### Basic Usage with Hook

```typescript
import { useAgeVerification } from '@/hooks/useAgeVerification';
import { AgeCategory } from '@/modules/age-verification';

function MyComponent() {
    const {
        isAvailable,
        isVerified,
        ageCategory,
        isLoading,
        error,
        requestVerification,
        meetsAgeRequirement,
    } = useAgeVerification();

    useEffect(() => {
        if (!isVerified && isAvailable) {
            // Request verification on first launch
            requestVerification();
        }
    }, [isVerified, isAvailable]);

    // Check age before showing age-restricted content
    const showRestrictedContent = async () => {
        const canView = await meetsAgeRequirement(AgeCategory.TEEN);
        if (canView) {
            // Show content
        } else {
            // Show age restriction message
        }
    };

    return (
        // Your component JSX
    );
}
```

### Using Service Directly

```typescript
import { AgeVerificationService, AgeCategory } from '@/modules/age-verification';

// Check if available
const isAvailable = await AgeVerificationService.isAvailable();

// Request verification
const result = await AgeVerificationService.requestVerification();
console.log('Age category:', result.ageCategory);
console.log('Has parental consent:', result.hasParentalConsent);

// Complete verification (deletes personal data)
await AgeVerificationService.completeVerification();

// Check age restrictions
const canAccess = await AgeVerificationService.enforceAgeRestriction(AgeCategory.ADULT);

// Check if user is minor
const isMinor = await AgeVerificationService.isMinor();

// Check if terms can be enforced
// Returns true for adults or minors with consent
const canEnforce = await AgeVerificationService.canEnforceTerms();
```

## Setup Requirements

### Google Play Console Configuration

1. **Enable Age Signals API** (Beta)

    - Go to Google Play Console
    - Navigate to your app
    - Enable Age Signals in app settings
    - This is currently in beta and requires enrollment

2. **Age Rating**

    - Complete the age rating questionnaire
    - Ensure proper content rating is set

3. **Age Verification Settings**
    - Configure age verification requirements
    - Set up parental consent requirements if applicable

### Build Configuration

The module automatically configures the Android build through the Expo config plugin. When you run `expo prebuild`, it will:

1. Add Google Play Services dependency to `app/build.gradle`
2. Configure the native Android code

### Testing

Since Age Signals API is in beta and requires Google Play Console configuration, testing in development has limitations:

**Development Testing:**

- The module is structured but returns mock data
- Age category will be `UNKNOWN` until configured in Play Console
- `isAvailable` will return false in most dev environments

**Production Testing:**

- Must be published through Google Play
- Requires Age Signals API to be enabled in Play Console
- Will return actual age data from Google Play

## Compliance Features

### Data Lifecycle

1. **Request**: Get age category and consent status from Google Play
2. **Store**: Temporarily store in AsyncStorage for session
3. **Verify**: Use data for age restrictions and compliance
4. **Delete**: Automatically delete personal data after verification

### Allowed Data Usage (per law)

- Enforce age-related restrictions in the app
- Ensure compliance with laws and regulations
- Implement safety-related features and defaults

### Prohibited Actions

- Sharing age category data with third parties
- Enforcing contracts against minors without parental consent
- Using data for purposes other than age verification

## API Reference

### AgeVerificationService

#### Static Methods

- `isAvailable()`: Check if Age Signals API is available
- `requestVerification()`: Request age verification from Google Play
- `getAgeCategory()`: Get cached age category
- `hasParentalConsent()`: Check parental consent status
- `isMinor()`: Check if user is under 18
- `isVerificationComplete()`: Check if verification is complete and valid
- `markVerificationComplete()`: Mark verification as complete
- `deleteVerificationData()`: Delete all age verification data (required by law)
- `enforceAgeRestriction(minimumAge)`: Check if user meets minimum age
- `canEnforceTerms()`: Check if terms/contracts can be enforced
- `completeVerification()`: Complete full verification lifecycle

### useAgeVerification Hook

#### Returned Values

- `isAvailable`: Whether Age Signals API is available
- `isVerified`: Whether user has been verified
- `ageCategory`: Current age category
- `isLoading`: Loading state
- `error`: Error if occurred

#### Returned Functions

- `requestVerification()`: Request verification
- `meetsAgeRequirement(minimumAge)`: Check age requirement
- `isMinor()`: Check if minor
- `hasParentalConsent()`: Check consent
- `canEnforceTerms()`: Check if terms can be enforced

## Implementation Notes

### Beta Status

The Google Play Age Signals API is currently in beta. This means:

1. **Limited Availability**: Not all apps/developers have access
2. **Configuration Required**: Must be enabled in Google Play Console
3. **API Changes**: API may change before general release
4. **Testing Limitations**: Hard to test without Play Store distribution

### Current Implementation

The current implementation:

- Provides complete infrastructure for Age Signals API
- Returns mock data in development (age category: UNKNOWN)
- Will work with actual API once configured in Play Console
- Includes all compliance features required by law

### Next Steps for Production

1. Enroll in Age Signals API beta (if not already enrolled)
2. Enable Age Signals in Google Play Console
3. Complete age rating questionnaire
4. Test with production build distributed through Play Store
5. Update native module to use actual Integrity API tokens
6. Implement token decoding to extract age data

## Security Considerations

1. **Data Encryption**: Age data is stored in AsyncStorage (encrypted on device)
2. **Data Deletion**: Personal data is deleted after verification per legal requirements
3. **Minimal Storage**: Only age category is retained for enforcing restrictions
4. **No Sharing**: Age data is never shared with third parties
5. **Secure APIs**: Uses Google Play's secure Integrity API

## Troubleshooting

### "Age verification not available"

- Age Signals API only works on Android
- Requires Google Play Services
- Must be configured in Google Play Console

### "Age category is UNKNOWN"

- Expected in development/testing
- Requires production build through Play Store
- Requires Age Signals API to be enabled in console

### "Failed to initialize Integrity Manager"

- Device may not have Google Play Services
- App may not be properly configured
- Check Play Console settings

## Resources

- [Google Play Age Signals API Overview](https://developer.android.com/google/play/age-signals/overview)
- [Age Verification Requirements](https://support.google.com/googleplay/android-developer/answer/16569691)
- [Expo Custom Native Code](https://docs.expo.dev/workflow/customizing/)
- [Texas HB 18 (Age Verification Law)](https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB18)
- [Utah HB 464 (Age Verification Law)](https://le.utah.gov/~2025/bills/static/HB0464.html)

## License

This module is part of the Pace Environmental Observatory App and is subject to the same license.
