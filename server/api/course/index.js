import { Router } from "express";

import courses from "../../course";

const router = Router();

router.get("/all", (req, res) => {
    res.send({
        result: courses
    });
});

router.get("/current", (req, res) => {
    if (!req.user)
    {
        res.send({
            error: {
                message: "尚未登录。"
            }
        });
        return;
    }

    const result = req.user.selectedCourseIds.map(id => {
        return courses[id];
    });

    res.set({
        "Cache-Control": "public, max-age=86400"
    });
    res.send({ result });
});

export default router;
