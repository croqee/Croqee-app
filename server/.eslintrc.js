/**
 * @typedef { import("@types/eslint").CLIEngine.Options } Options
 */

const isProduction = process.env.NODE_ENV === 'production';

/** @type {Options} */
module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    es2020: true,
  },
  plugins: ['import', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  // ignorePatterns: [],
  rules: {
    'no-console': isProduction
      ? ['error', { allow: ['warn', 'error', 'info', 'debug'] }]
      : 'off',
    'no-debugger': isProduction ? 'error' : 'off',
    'object-shorthand': 'error',
    'no-unused-vars': 'off',
    'no-undef': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    'no-redeclare': 'error',
    'no-var': 'error',
    'sort-vars': 'warn',
    // 'sort-imports': 'error',
    'sort-keys': [
      'error',
      'asc',
      { caseSensitive: true, natural: true, minKeys: 2 },
    ],
    'prefer-const': 'error',
    // 'max-len': ['error', { tabWidth: 2, ignoreComments: true }],
    'import/no-unresolved': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-unused-modules': 'error',
    // 'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['./tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc' },
      },
    ],
    'import/extensions': ['error', 'always', { ts: 'never', js: 'never' }],
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
    'import/resolver': {
      typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
    },
    'import/cache': { lifetime: 10 },
  },
};
