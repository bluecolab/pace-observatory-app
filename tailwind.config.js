/* Config file for Tailwind (styles).
 * Uses:
 *  - Here you can set up custom classes for colors, margin, padding etc...
 *
 * More info: https://v2.tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/app/**/*.{js,ts,tsx}', './src/components/**/*.{js,ts,tsx}'],
    darkMode: 'class',
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                lightBackground: '#d6d6d6',
                lightCardBackground: '#f7f7f7',
                lightCardBackgroundLvl1: '#ffffff',
                darkBackground: '#121212',
                darkCardBackground: '#2C2C2E',
                darkCardBackgroundLvl1: '#48484A',
                darkText: '#dbdbdb',
                darkTextLvl1: '#cbcbcb',
            },
            padding: {
                default: '10',
            },
            margin: {
                default: '10',
            },
        },
    },
    plugins: [],
};
