module.exports = {
  extends: 'erb',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'react/prop-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    'import/prefer-default-export': 'off',
    'global-require': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-nested-ternary': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-new': 'off',
    'class-methods-use-this': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
