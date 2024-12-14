import reactPlugin from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error' // Treat Prettier issues as errors
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      browser: true,
      es2021: true,
    },
  },
];
