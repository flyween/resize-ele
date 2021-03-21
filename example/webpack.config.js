const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const pkg = require('./package.json')
const outputPath = path.resolve(__dirname, 'dist')

module.exports = {
  entry: './index.js',
  output: {
    path: outputPath,
    filename: 'app.[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true
              }
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      templateParameters: {
        pkg: pkg
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    port: 9000
  }
}
