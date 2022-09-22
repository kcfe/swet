module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['dirs'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/naming-convention': [
      'off',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: ['memberLike', 'property', 'method'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
        modifiers: ['private'],
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'dirs/dirnames': ['error', { pattern: '^([a-z0-9\\-]+)|__tests__$' }],
    'dirs/filenames': [
      'error',
      {
        '**/*.md/*': '.*',
        '**/*': '^[a-z0-9A-Z\\-\\.]+$',
      },
    ],
    'import/order': 'off',
  },
}
