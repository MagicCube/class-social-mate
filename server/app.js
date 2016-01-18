const devMode = (process.env.NODE_ENV !== "production");

import express from "express";
import bodyParser from "body-parser";
import config from "config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Path from "path";
import session from "express-session";
import router from "./router";

mongoose.connect(config.get("db.mongodb.url"));

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
        url: config.get("db.mongodb.url"),
        touchAfter: 24 * 3600 // time period in seconds
    })
}));

// Static files
app.use(express.static("server/public", { maxAge: "365 days" }));

// Client assets
if (devMode)
{
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackConfig = require("../webpack.config");
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
}


// View engine setup
app.set("view engine", "jade");
app.set("views", Path.join(__dirname, "view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

export default app;
