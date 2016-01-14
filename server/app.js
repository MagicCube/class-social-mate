const devMode = (process.env.NODE_ENV !== "production");

import express from "express";
import bodyParser from "body-parser";
import config from "config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Path from "path";
import session from "express-session";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

import webpackConfig from "../webpack.config";
import router from "./router";

mongoose.connect(config.get("db.mongodb.url"));

// Express
const app = express();

// Session
app.use(session({ secret: "mate-social-class", cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }}))

// Static files
app.use(express.static("server/public", { maxAge: "365 days" }));

// Client assets
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));


// View engine setup
app.set("view engine", "jade");
app.set("views", Path.join(__dirname, "view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

export default app;
