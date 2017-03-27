var autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        "./src/index.tsx"
    ],
    output: {
        filename: "./dist/bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { 
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            { 
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader?sourcemaps", "postcss-loader", "sass-loader?sourcemaps"]
            },
            { 
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file?name=[path][name].[hash].[ext]"
            }
        ],

        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    watch: true
};