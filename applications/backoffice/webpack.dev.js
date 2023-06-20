const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');

const contentbase = path.join(__dirname, 'public')

PORT = 3001;

var proxyTarget = 'https://__APP_NAME__/'
if (process.env.USE_MOCKS) {
  console.log('Using mocks')
  proxyTarget = `http://localhost:${PORT}/api-mocks`
}



module.exports = env => {
  const osbDomain = env && env.DOMAIN ? env.DOMAIN : 'osb.local';
  const replaceHost = (uri, appName) => uri.replace("__APP_NAME__", appName + '.' + osbDomain);

  function setEnv(content) {
    console.log("Replacing ENV", env);
    let result = content.toString();
    for (const v in env) {
      result = result.replace(new RegExp(`__${v}__`), env[v]);
    }
    console.log(result);
    return result;
  }

  console.log(env)

  return merge(
    common(env),
    {
      mode: 'development',
      devtool: 'source-map',
      devServer: {



        compress: true,
        https: true,
        allowedHosts: "all",
        historyApiFallback: true,
        static: [{
          directory: path.resolve(__dirname, 'public'),
          publicPath: '/',
        }],
        proxy: {
          '/proxy/workspaces': {
            target: env.WORKSPACES_DOMAIN || replaceHost(proxyTarget, 'workspaces'),
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/proxy/workspaces': '' }
          },
          '/proxy/accounts-api': {
            target: env.ACCOUNTS_API_DOMAIN ? (env.ACCOUNTS_API_DOMAIN) : replaceHost(proxyTarget, 'api.accounts'),
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/proxy/accounts-api': '' }
          }
        },
        port: PORT,

      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify("development")
        }),
        new webpack.EnvironmentPlugin({
          'DOMAIN': env.DOMAIN || 'v2.opensourcebrain.org',
          'NAMESPACE': env.NAMESPACE || 'osb2',
          "ACCOUNTS_API_DOMAIN ": env.ACCOUNTS_API_DOMAIN || '',
          "WORKSPACES_DOMAIN ": env.WORKSPACES_DOMAIN || '',
        }),
        new CopyPlugin({
          patterns: [
            {
              from: './src/assets-parametrized',
              to: contentbase,
              transform(content, path) {
                return setEnv(content);
              }
            },
            {
              from: './src/assets',
              to: contentbase,
            },

          ]
        }),
      ],

    })
};
