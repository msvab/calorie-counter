'use strict'
const path = require('path')
const webpack = require('webpack')

const ROOT_PATH = path.resolve(__dirname)

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(ROOT_PATH, 'app/build'),
    historyApiFallback: true,
    hot: true,
    inline: true
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: path.resolve(ROOT_PATH, 'app/src')
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      }
    ]
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}