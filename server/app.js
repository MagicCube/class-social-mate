import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const devMode = (process.env.NODE_ENV !== "production");

// Express
var app = express();

// view engine setup
app.set("view engine", "jade");
// app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

export default app;
