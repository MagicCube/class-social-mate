import { Router } from "express";

import User from "../../../lib/model/user";

const router = Router();

router.get("/all", (req, res) => {
    const query = User.find({});
    query.exec((err, users) => {
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
