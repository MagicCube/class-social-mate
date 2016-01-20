import { Router } from "express";

import User from "../../model/user";

const router = Router();

router.get("/all", (req, res) => {
    User.find({}, (err, users) => {
        if (!err)
        {
            res.send({
                count: users.length,
                result: users
            });
        }
        else
        {
            res.send({
                error: err
            });
        }
    });
});

router.get("/current", (req, res) => {
    res.send({
        result: req.user ? req.user : null
    });
});

export default router;
