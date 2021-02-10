const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');

const contentbase = path.join(__dirname, 'public')

PORT = 3000;

var proxyTarget = 'https://__APP_NAME__/'
if (process.env.USE_MOCKS) {
  console.log('Using mocks')
  proxyTarget = `http://localhost:${PORT}/api-mocks`
}



module.exports = env => {
  const osbDomain = env && env.DOMAIN ? env.DOMAIN : 'osb.local';
  const replaceHost = (uri, appName) => uri.replace("__APP_NAME__", appName + '.' + osbDomain);
  return merge(
    {
      mode: 'development',
      devtool: 'eval-source-map',
      devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: path.join('js', 'bundle.js'),
        compress: true,
        https: true,
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
          '/api/workspaces': {
            target: replaceHost(proxyTarget, 'workspaces'),
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/api/workspaces': '' }
          },
          '/workspaces/': {
            target: replaceHost(proxyTarget, 'workspaces'),
            secure: false,
            changeOrigin: true,
          }
        },
        port: PORT,

      },

      plugins: [
        new CopyPlugin([
          {
            from: './src/assets-parametrized', contentbase,
            transform(content, path) {
              return setEnv(content);
            }
          },
          {
            from: './src/assets', contentbase,
          },

        ]),
      ],

    }, common(env))
};
