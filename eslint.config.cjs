const pluginImport = require('eslint-plugin-import');
const path = require('path');
const tsParser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('@typescript-eslint/eslint-plugin');

module.exports = [
    {
        files: [
            'app/**/*.{js,ts,jsx,tsx}',
            'components/**/*.{js,ts,jsx,tsx}',
            'contexts/**/*.{js,ts,jsx,tsx}',
            'hooks/**/*.{js,ts,jsx,tsx}',
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                project: './tsconfig.json',
            },
        },
        plugins: {
            import: pluginImport,
            '@typescript-eslint': tseslint,
            react: pluginReact,
            'react-hooks': pluginReactHooks,
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    project: path.resolve('./tsconfig.json'),
                },
            },
        },
        rules: {
            // General formatting
            'no-trailing-spaces': 'warn',

            // Imports
            'import/no-unresolved': 'error',
            'import/namespace': 'error',
            'import/no-duplicates': 'error',

            // React
            'react/jsx-key': 'error',
            'react/no-unstable-nested-components': 'error',

            // React Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',

            // TypeScript rules
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
];
