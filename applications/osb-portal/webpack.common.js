const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var path = require('path');
var contentbase = path.join(__dirname, 'public')

console.log(contentbase);


module.exports = env => {
  if (!env) {
    env = {}
  }



  return {
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: path.join('js', 'bundle.js')
    },

    performance: {
      hints: false
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js"]
    },

    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.EnvironmentPlugin({ 'DOMAIN': env.DOMAIN || null, 'NAMESPACE': env.NAMESPACE || null }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/assets', to: contentbase,
          },

        ]
      }),
    ],
  }
};