import { Router } from "express";

import api from "../api";
import auth from "./auth";
import ensureLogin from "./auth/ensure-login"

const router = Router();

router.all("*", function(req, res, next) {
    req.user = req.session.user ? req.session.user : null;
    next();
});

router.use("/auth", auth);
router.use("/api", api);

router.get("/", ensureLogin, (req, res) => {
    res.render("index");
});

export default router;
