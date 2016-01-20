import { Router } from "express";

import app from "../../app";

const router = Router();

router.get("/login", (req, res) => {
    let errorMessage = null;
    if (req.session.authErrorMessage)
    {
        errorMessage = req.session.authErrorMessage;
        req.session.authErrorMessage = null;
    }
    res.render("auth/login", {
        app,
        redirectUrl: req.query.redirect ? req.query.redirect : "/",
        authErrorMessage: errorMessage
    });
});

export default router;
