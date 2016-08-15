'use strict'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const merge = require('webpack-merge')
const validate = require('webpack-validator')

const devConfig = require('./webpack.dev')
const productionConfig = require('./webpack.production')

const ROOT_PATH = path.resolve(__dirname)
const env = process.env.NODE_ENV || 'dev'

const commonConfig = {
  entry: {
    js: ['babel-polyfill', 'isomorphic-fetch', path.resolve(ROOT_PATH, 'app/src/app.js')],
    css: path.resolve(ROOT_PATH, 'app/styles/site.scss')
  },
  output: {
    path: path.resolve(ROOT_PATH, 'app/build'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap')
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.eot$|\.woff2$/,
        loader: "file"
      }
    ],
    noParse: [/moment.js/]
  },
  plugins: [
    new ExtractTextPlugin('site.css'),
    new CopyWebpackPlugin([
      { from: 'app/resources', to: '.' }
    ])
  ]
}

const config = env === 'production' ? merge(commonConfig, productionConfig) : merge(commonConfig, devConfig)
module.exports = validate(config)
