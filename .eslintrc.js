module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  overrides: [
    {
      files: './test/*.js',
      env: {
        jest: true,
      },
    },
  ],
}
