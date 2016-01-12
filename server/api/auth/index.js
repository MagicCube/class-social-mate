import { Router } from "express";

import Auth from "../../nju-mba/auth";
import User from "../../model/user";

const router = Router();
const authMap = new Map();

router.get("/captcha", (req, res) => {
    const auth = _getAuth(req);
    auth.downloadCaptchaImage().pipe(res);
});

router.post("/login", (req, res) => {
    const auth = _getAuth(req);
    auth.login({
        schoolNum: req.body.schoolnum,
        password: req.body.password,
        captcha: req.body.captcha,
    }, (err) => {
        if (!err)
        {
            User.findBySchoolNum(auth.schoolNum, (err, user) => {
                if (user)
                {
                    req.session.user = {
                        _id: user._id,
                        name: user.name,
                        schoolNum: user.schoolNum,
                        selectedCourseIds: user.selectedCourseIds
                    };
                    res.send(req.session.user);
                }
                else
                {
                    res.send("Not existed.");
                }
            });
        }
        else
        {
            res.send({
                error: {
                    message: err.message
                }
            });
        }
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.end();
});

function _getAuth(req)
{
    const sid = req.session.id;
    if (!authMap.get(sid))
    {
        authMap.set(sid, new Auth());
    }
    return authMap.get(sid);
}

export default router;
