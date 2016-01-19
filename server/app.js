const devMode = (process.env.NODE_ENV !== "production");

import express from "express";
import bodyParser from "body-parser";
import config from "config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Path from "path";
import session from "express-session";
import router from "./router";

let mongoDbUrl = config.get("db.mongodb.url");
if (mongoDbUrl === "VCAP_SERVICES" && process.env.VCAP_SERVICES)
{
    try
    {
        mongoDbUrl = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri;
    }
    catch (e)
    {

    }
}

mongoose.connect(mongoDbUrl);

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
        url: mongoDbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    })
}));

// Static files
let assetsPath = "/assets";
app.use(express.static("server/public", { maxAge: "365 days" }));
if (!devMode)
{
    const assets = require("./public/assets/build.json");
    assetsPath = "/assets/" + assets.hash;
    app.use(assetsPath, express.static("server/public/assets", { maxAge: "365 days" }));
}
app.set("assets path", assetsPath);

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
