/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import SentryWebpackPlugin from '@sentry/webpack-plugin';

import { version, dependencies as externals } from '../../src/package.json';

const src = path.join(__dirname, '../../src');

const result = {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },

  output: {
    path: src,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [src, 'node_modules'],
    alias: {
      '@src': src,
      '@main': path.resolve(src, 'main'),
      '@renderer': path.resolve(src, 'renderer'),
      '@shared': path.resolve(src, 'shared'),
      '@core': path.resolve(src, 'renderer/core'),
      '@logHandler': path.resolve(src, 'renderer/logHandler'),
      '@suspension': path.resolve(src, 'renderer/suspension'),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],

  optimization: {
    moduleIds: 'named',
  },
};

if (process.env.NODE_ENV === 'production') {
  result.plugins.push(
    new SentryWebpackPlugin({
      // sentry-cli configuration
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'hbt',
      project: 'app',
      release: version,
      // webpack specific configuration
      include: './src/dist',
      urlPrefix: '~/dist/',
      ignore: ['node_modules'],
    })
  );
}

export default result;
