const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');

const contentbase = path.join(__dirname, 'public')
const osbDomain = 'osb.local';

module.exports = merge({
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: path.join('js', 'bundle.js'),
    compress: true,
    https: true,
    disableHostCheck: true,
    proxy : [
      {
        path : '/api/workspaces',
        target : 'http://workspaces.'+osbDomain,
        secure : false,
        changeOrigin: true,
        pathRewrite: {'^/api/workspaces' : ''}
      },
    ],
    port: 443
  },

  plugins: [
    new CopyPlugin([
        { from: './src/assets/keycloak_dev.json', to: contentbase + '/keycloak.json' },
    ]),
  ],

}, common);