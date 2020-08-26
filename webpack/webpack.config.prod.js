const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: './js/[name].js',
  },
  module: {
    rules: [
      {test: /\.html$/, use: [{loader: 'html-loader'}]},
      {
        test: /\.s[ac]ss$/i, use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']},
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'file-loader',
          options: {name: '[name].[ext]', outputPath: 'img', esModule: false},
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'home.html',
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
  ],
};
