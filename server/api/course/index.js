import { Router } from "express";

import courses from "../../course";

const router = Router();

router.get("/", (req, res) => {
    res.set({
        "Cache-Control": "public, max-age=86400"
    });
    res.send({
        result: courses
    });
});

export default router;
