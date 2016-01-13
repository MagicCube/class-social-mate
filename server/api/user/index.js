import { Router } from "express";

const router = Router();

router.get("/current", (req, res) => {
    res.send({
        result: req.user ? req.user : null
    });
});

export default router;
