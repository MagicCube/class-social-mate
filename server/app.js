const devMode = (process.env.NODE_ENV !== "production");

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Path from "path";
import session from "express-session";
import router from "./router";


// Mongoose
import mongoose from "../mongoose";


// Express
const app = express();



// Session
const MongoStore = require("connect-mongo")(session);
app.use(session({
    secret: "mate-social-class",
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        touchAfter: 24 * 3600 // time period in seconds
    })
}));



// Client assets
let assetsPath = "/assets";
app.use(express.static("server/public", { maxAge: "365 days" }));
if (!devMode)
{
    // Production mode
    const assets = require("./public/assets/build.json");
    assetsPath = "/assets/" + assets.hash;
    app.use(assetsPath, express.static("server/public/assets", { maxAge: "365 days" }));
}
else
{
    // Development mode
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackConfig = require("../webpack.config");
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
}
app.set("assets path", assetsPath);


// View engine setup
app.set("view engine", "jade");
app.set("views", Path.join(__dirname, "view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Routers
app.use(router);


// Exports
export default app;
