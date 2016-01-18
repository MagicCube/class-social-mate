import { Router } from "express";

import Auth from "../../nju-mba/auth";
import Elective from "../../nju-mba/elective";
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
                if (!err)
                {
                    if (!user)
                    {
                        const elective = new Elective({ auth });
                        elective.loadSelectedCourses(() => {
                            if (elective.selectedCourseIds.length === 0)
                            {
                                _responseErrorWith(req, res, "没有查找到您的选修课程，请先登陆 http://nubs.nju.edu.cn/mba/ 进行选课。");
                            }
                            else
                            {
                                elective.save((err, user) => {
                                    if (!err)
                                    {
                                        // Success
                                        _responseSuccessWith(req, res, user);
                                    }
                                    else
                                    {
                                        _responseErrorWith(req, res, err);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        // Success
                        _responseSuccessWith(req, res, user);
                    }
                }
                else
                {
                    _responseErrorWith(req, res, err);
                }
            });
        }
        else
        {
            _responseErrorWith(req, res, err);
        }
    });
});

router.all("/logoff", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


function _transformUserToJSON(user)
{
    return {
        id: user.id,
        name: user.name,
        schoolNum: user.schoolNum,
        selectedCourseIds: user.selectedCourseIds
    };
}

function _responseSuccessWith(req, res, user)
{
    console.info(`User authenticated: ${user.name}, ${JSON.stringify(user)})`);
    _destroyAuth(req);
    req.session.user = _transformUserToJSON(user);
    const redirectUrl = req.query.redirect ? req.query.redirect : "/";
    req.session.authErrorMessage = null;
    res.redirect(redirectUrl);
}

function _responseErrorWith(req, res, err)
{
    console.error("User authentication failed: " + err);
    let message = null;
    if (typeof(err) === "string")
    {
        message = err;
    }
    else if (err instanceof Error)
    {
        message = err.message;
    }
    req.session.authErrorMessage = message;
    res.redirect("/auth/login");
}

function _getAuth(req)
{
    const sid = req.session.id;
    if (!authMap.get(sid))
    {
        authMap.set(sid, new Auth());
    }
    return authMap.get(sid);
}

function _destroyAuth(req)
{
    const sid = req.session.id;
    if (authMap.has(sid))
    {
        authMap.delete(sid);
    }
}

export default router;
