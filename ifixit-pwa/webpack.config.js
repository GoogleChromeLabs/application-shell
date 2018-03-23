const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

module.exports = {
  entry: [
    path.join(SRC, 'components', 'client.jsx')
  ],
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ]
        }
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SRC, 'static', 'index.html')
    })
  ],
  output: {
    path: DIST,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: DIST
  }
};
