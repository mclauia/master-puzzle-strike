var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlConfig = {
  inject: true,
  template: 'src/index.html',
  filename: '../index.html'
};

var config = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    app: path.resolve(__dirname, './src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, './assets/'),
    filename: 'index.js',
    publicPath: 'assets'
  },
  module: {

    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: 'es2015',
              plugins: ['transform-object-rest-spread', 'transform-react-jsx']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
                failOnWarning: false,
                failOnError: false,
                emitWarning: true,
            }
          }
        ],
        include: path.resolve(__dirname, './src')
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ],
        include: path.resolve(__dirname, './src')
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin(htmlConfig)]
};

module.exports = config;
