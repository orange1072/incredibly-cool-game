// .eslintrc.cjs для корня проекта
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Не нужно в React 17+
  },
  ignorePatterns: [
    'packages/client/public/**/*',
    'node_modules',
    'dist',
    'packages/client/server/**/*',
    'packages/client/src/slices/**/*',
    'packages/client/src/pages/**/*',
    'packages/client/src/components/**/*',
    'packages/client/src/entry-server.utils.ts',
    'packages/client/jest.config.js',
    'packages/client/src/App.tsx',
    'packages/client/src/App.test.tsx',
  ],
}
