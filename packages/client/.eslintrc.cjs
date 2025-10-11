// .eslintrc.js
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
    project: './tsconfig.json',
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
    'node_modules',
    'dist',
    'server/**/*',
    'src/slices/**/*',
    'src/pages/**/*',
    'src/components/**/*',
    'src/entry-server.tsx',
    'src/entry-server.utils.ts',
    'vite.config.ts',
    'jest.config.js',
    'src/App.tsx',
    'src/App.test.tsx',
  ],
}
