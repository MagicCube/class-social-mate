const devMode = (process.env.NODE_ENV !== "production");

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// NOTE: All the paths defined in plugins are related to output.path.
const plugins = [
    new webpack.ProvidePlugin({
        "$": "jquery",
        "jQuery": "jquery",
        "mx": path.join(__dirname, "./client/mx")
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "./vendor/vendor.js",
        minChunks: Infinity
    }),
    new ExtractTextPlugin("./[name]/res/[name].css")
];

if (!devMode)
{
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = {
    // This is the root of client source codes.
    context: path.join(__dirname, "./client"),
    entry: {
        vendor: [ "jquery", "bootstrap", path.join(__dirname, "./client/mx") ],
        common: [ "./common/res/index.less" ],
        auth: [
            "./auth",
            "./auth/res/index.less"
        ]
    },
    output: {
        // webpack-dev-server will server output.path as output.publicPath
        path: path.join(__dirname, "./server/public/assets/"),
        publicPath: "/assets/",
        filename: "[name]/[name].js",
        chunkFilename: "[id]/[id].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
        ]
    },
    plugins: plugins
};
