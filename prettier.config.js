module.exports = {
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('prettier-plugin-organize-imports'),
  ],
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
}
