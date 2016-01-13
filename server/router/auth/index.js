import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
    res.render("auth/login", {
        redirectUrl: req.query.redirect ? req.query.redirect : "/",
        authErrorMessage: req.session.authErrorMessage ? req.session.authErrorMessage : null
    });
});

export default router;
