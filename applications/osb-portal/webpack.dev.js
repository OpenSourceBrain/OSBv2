const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');

const contentbase = path.join(__dirname, 'public')
const osbDomain = 'v2.opensourcebrain.org';
PORT = 3000;

var proxyTarget = 'https://__APP_NAME__/'
if (process.env.USE_MOCKS){
  console.log('Using mocks')
  proxyTarget = `http://localhost:${PORT}/api-mocks`
}

const replaceHost = (uri, appName) => uri.replace("__APP_NAME__", appName + '.' + osbDomain);
console.log(replaceHost( proxyTarget, 'workspaces'));

module.exports = merge({
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: path.join('js', 'bundle.js'),
    compress: true,
    https: false,
    disableHostCheck: true,
    historyApiFallback: true,
    proxy : [
      {
        path : '/api/workspaces',
        target : replaceHost( proxyTarget, 'workspaces'),
        secure : false,
        changeOrigin: true,
        pathRewrite: {'^/api/workspaces' : ''}
      },
    ],
    port: PORT
  },



}, common);
