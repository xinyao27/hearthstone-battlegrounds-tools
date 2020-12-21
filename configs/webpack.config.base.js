/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import SentryWebpackPlugin from '@sentry/webpack-plugin';
import { version, dependencies as externals } from '../app/package.json';

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
    ],
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '..', 'app'), 'node_modules'],
    alias: {
      '@app': path.resolve(__dirname, '../app'),
      '@main': path.resolve(__dirname, '../app/main'),
      '@renderer': path.resolve(__dirname, '../app/renderer'),
      '@shared': path.resolve(__dirname, '../app/shared'),
      '@core': path.resolve(__dirname, '../app/renderer/core'),
      '@logHandler': path.resolve(__dirname, '../app/renderer/logHandler'),
      '@suspension': path.resolve(__dirname, '../app/renderer/suspension'),
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
      include: './app/dist',
      urlPrefix: '~/dist/',
      ignore: ['node_modules'],
    })
  );
}

export default result;
