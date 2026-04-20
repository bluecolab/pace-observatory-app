const pluginImport = require('eslint-plugin-import');
const path = require('path');
const tsParser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
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
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            // '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',

            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    'newlines-between': 'always',
                },
            ],

            'no-undef': 'error',
        },
    },
];
