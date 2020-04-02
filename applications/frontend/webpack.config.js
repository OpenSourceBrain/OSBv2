const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');
var contentbase = path.join(__dirname, 'public')

console.log(contentbase);
module.exports = {
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: path.join('js', 'bundle.js')
    },

    performance: {
        hints: false
    },

    // watch: true,

    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: path.join('js', 'bundle.js'),
        compress: false,
        port: 8080
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
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: [
        new CopyPlugin([
            { from: './src/assets', contentbase },
        ]),
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};