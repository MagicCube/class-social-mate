import { Router } from "express";

const router = Router();

router.get("/current", (req, res) => {
    res.send({
        result: req.session.user
    });
});

export default router;
