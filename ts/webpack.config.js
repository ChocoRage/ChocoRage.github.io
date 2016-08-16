module.exports = {
    entry: [
        "./src/index.tsx",
        "./assets/images/grass.png"
    ],
    output: {
        filename: "./dist/bundle.js",
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
                loaders: ["style", "css?sourcemaps", "sass?sourcemaps"]
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

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    watch: true
};