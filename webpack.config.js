const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const NUMBER_OF_COMMANDS = 20;

/**
 * Generates the manifest file using the package.json informations
 * @param content
 * @returns {Buffer}
 */
function transformManifest(content) {
  const commands = {};

  for (let commandId = 1; commandId <= NUMBER_OF_COMMANDS; commandId++) {
    commands[commandId] = {
      description: `Command ${commandId.toString().padStart(2, '0')}`,
    };
  }

  return Buffer.from(JSON.stringify({
    version: process.env.npm_package_version,
    commands,
    ...JSON.parse(content.toString()),
  }));
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  devtool: devMode ? 'inline-source-map' : false,
  context: path.resolve(__dirname, 'src'),

  entry: {
    options: './js/options/index.jsx',
    background: './js/background.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.scss', '.css'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      styles: path.resolve(__dirname, 'src/styles'),
    },
    modules: [
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'src/js/options'),
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    // Clean the dist folder
    new CleanWebpackPlugin({
      verbose: true,
      // Ignore manifest.json otherwise, it will be deleted after rebuilding
      cleanAfterEveryBuildPatterns: ['!manifest.json', '!**/messages.json'],
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/manifest.json'),
      transform: transformManifest,
    }]),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/_locales/**/messages.json'),
    }]),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new WriteFilePlugin(),
  ],

  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
    watchContentBase: true,
    port: 3000,
  },
};
