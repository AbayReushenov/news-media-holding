import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [js.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
          // Warn on hardcoded Cyrillic text literals to promote i18n usage
      'no-hardcoded-cyrillic/no-hardcoded-cyrillic': 'warn',
    },
    plugins: {
      'no-hardcoded-cyrillic': (await import('./eslint-rules/no-hardcoded-cyrillic.js')).default,
    },
    },
    {
        files: ['vite.config.js', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                process: true,
            },
            sourceType: 'module',
        },
    },
])
