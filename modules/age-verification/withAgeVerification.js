/**
 * Expo config plugin for Google Play Age Signals API integration
 * This plugin configures the Android build to include necessary dependencies
 * for accessing age verification data from Google Play
 */

const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Add Age Signals API dependencies to app/build.gradle
 */
const withAgeVerificationAppGradle = (config) => {
    return withAppBuildGradle(config, (config) => {
        const buildGradle = config.modResults.contents;

        // Add Play Services dependency for Age Signals API
        // Note: Version 18.5.0 is the minimum required version. The Age Signals API is in beta
        // and may require updates as the API evolves. Consider using 18.5.+ for flexibility.
        const dependencyString = `
    // Google Play Age Signals API dependencies (minimum version 18.5.0)
    implementation 'com.google.android.gms:play-services-base:18.5.0'
`;

        // Check if the full dependency line is already present to avoid duplication
        if (
            buildGradle.includes(
                "implementation 'com.google.android.gms:play-services-base:18.5.0'"
            )
        ) {
            return config;
        }

        // Insert after the opening of dependencies block
        config.modResults.contents = buildGradle.replace(
            /dependencies\s*{/,
            `dependencies {${dependencyString}`
        );

        return config;
    });
};

/**
 * Main plugin function
 */
const withAgeVerification = (config) => {
    config = withAgeVerificationAppGradle(config);
    return config;
};

module.exports = withAgeVerification;
