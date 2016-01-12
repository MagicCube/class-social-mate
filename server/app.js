import express from "express";
import bodyParser from "body-parser";
import config from "config";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";

import router from "./router";

const devMode = (process.env.NODE_ENV !== "production");

mongoose.connect(config.get("db.mongodb.url"));

// Express
var app = express();

// Session
app.use(session({ secret: "mate-social-class", cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }}))

// Static files
app.use(express.static("server/public"));

// View engine setup
app.set("view engine", "jade");
// app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

export default app;
