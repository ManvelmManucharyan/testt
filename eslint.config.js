import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...eslintPluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['*.vue', '**/*.vue', '*.js', '**/*.js'],
    rules: {
      'no-console': 'error',
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 0,
      'vue/require-default-prop': 0,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'helm/',
      'public/',
      'src/assets/**',
      '*.css',
    ],
  },
];
