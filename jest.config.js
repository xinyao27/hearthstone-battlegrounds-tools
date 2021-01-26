module.exports = {
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.erb/mocks/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src/node_modules'],
  setupFiles: ['./.erb/scripts/CheckBuildsExist.js'],
}
