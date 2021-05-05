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
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader"
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
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
        },

      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.EnvironmentPlugin({ 'DOMAIN': env.DOMAIN || 'v2.opensourcebrain.org', 'NAMESPACE': env.NAMESPACE || 'osb2' }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/assets-parametrized', to: contentbase,
          },
          {
            from: './src/assets', to: contentbase,
          },

        ]
      }),
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
      "react": "React",
      "react-dom": "ReactDOM"
    }
  }
};