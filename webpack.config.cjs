/* eslint-disable prettier/prettier */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './dev/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dev/dist'),
      filename: 'app.js',
      clean: true,
      publicPath: isProduction ? '/react-marquee-master/' : '/',
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dev'),
      },
      compress: true,
      port: 3001,
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: 'tsconfig.dev.json',
            },
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './dev/index.html',
      }),
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  }
}
