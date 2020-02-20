module.exports = {
  extends: '@hehe.x',
  overrides: [
    {
      files: './test/*.js',
      env: {
        jest: true,
      },
    },
  ],
}
