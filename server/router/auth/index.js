import { Router } from "express";

import app from "../../app";

const router = Router();

router.get("/login", (req, res) => {
    res.render("auth/login", {
        app,
        redirectUrl: req.query.redirect ? req.query.redirect : "/",
        authErrorMessage: req.session.authErrorMessage ? req.session.authErrorMessage : null
    });
});

export default router;
