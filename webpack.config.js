const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => ({
  entry: './src/client/index.js',
  devtool: argv.mode === 'development' && 'cheap-module-eval-source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.mjs']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/i,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false
        }
      }
    ]
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: './public/index.html',
      minify: argv.mode === 'production' && { // Default behavior in html-webpack-plugin v4 (not yet in v3)
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ]
})
