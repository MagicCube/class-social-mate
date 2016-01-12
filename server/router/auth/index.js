import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
    res.render("auth/login", { redirectUrl: req.query.redirect });
});

export default router;
