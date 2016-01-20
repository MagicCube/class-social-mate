import cheerio from "cheerio";
import request from "request";

export default class Auth
{
    constructor()
    {
        this.schoolNum = null;
        this.name = null;
        this.cookieJar = request.jar();
    }

    downloadCaptchaImage()
    {
        return request.get({
            url: "http://njubs.nju.edu.cn/images/verificationimg.php",
            jar: this.cookieJar
        });
    }

    login({ schoolNum, password, captcha }, cb)
    {
        if (!captcha)
        {
            cb(new Error("登陆失败，请输入验证码。"));
            return;
        }
        if (!schoolNum || schoolNum.trim() === "")
        {
            cb(new Error("登陆失败，请输入学号。"));
            return;
        }
        if (!password)
        {
            cb(new Error("登陆失败，请输入密码。"));
            return;
        }

        schoolNum = schoolNum.toUpperCase();
        if (schoolNum.indexOf("MF"))
        {
            cb(new Error("登陆失败，南京大学 MBA 学号必须以字母“MF”开头。"));
            return;
        }

        console.log(`[${schoolNum}] User is now signing in njubs.nju.edu.cn...`);
        request.post({
            url: "http://njubs.nju.edu.cn/mba/login.php",
            headers: {
                Origin: "http://njubs.nju.edu.cn",
                Referer: "http://njubs.nju.edu.cn/mba/index.php"
            },
            jar: this.cookieJar,
            form: { txtuser: schoolNum, txtpass: password, ver: captcha }
        }, (err, res, body) => {
            if (!err && res.statusCode === 200)
            {
                console.log(`[${schoolNum}] njubs.nju.edu.cn responsed back.`);

                if (body.trim() !== "登录错误")
                {
                    this.schoolNum = schoolNum;
                    this._fetchName((error, name) => {
                        if (!error)
                        {
                            if (name)
                            {
                                cb()
                            }
                            else
                            {
                                console.error(`[${schoolNum}] Fail to fetch name from njubs.nju.edu.cn 0`);
                                cb(new Error("登录失败，请检查学号、密码和验证码。"));
                            }
                        }
                        else
                        {
                            cb(new Error("登录失败，请检查学号、密码和验证码。"));
                        }
                    });
                }
                else
                {
                    console.error(`[${schoolNum}] njubs.nju.edu.cn responsed with error: ${body.trim()}`);
                    cb(new Error("登录失败，请检查学号、密码和验证码。"));
                }
            }
            else
            {
                console.error(`[${schoolNum}] njubs.nju.edu.cn responsed with status ${res.statusCode}.`);
                console.error(err);
                cb(new Error("登录失败，请检查学号、密码和验证码。"));
            }
        });
    }

    _fetchName(cb)
    {
        request.get({
            url: "http://njubs.nju.edu.cn/mba/admin_index.php?admin=1120",
            headers: {
                "Origin": "http://njubs.nju.edu.cn",
                "Referer": "http://njubs.nju.edu.cn/mba/"
            },
            jar: this.cookieJar
        }, (err, res, body) => {
            if (!err && res.statusCode === 200)
            {
                const $ = cheerio.load(body);
                const h5 = $("#lefta h5").text().trim();
                if (h5.indexOf(this.schoolNum) === 0)
                {
                    this.name = h5.substr(this.schoolNum.length);
                    cb(null, this.name)
                }
                else
                {
                    console.error(`[${this.schoolNum}] Fail to fetch name from njubs.nju.edu.cn 1`);
                    console.error(body);
                    if (body.indexOf("黑客") !== -1)
                    {
                        cb(new Error("由于南大商学院官网启用了网络安全措施，本应用暂时无法登录。"));
                    }
                    else
                    {
                        cb(new Error("登录失败，请检查学号、密码和验证码。"));
                    }
                }
            }
            else
            {
                console.error(`[${this.schoolNum}] Fail to fetch name from njubs.nju.edu.cn 2`);
                console.error(err);
                console.error(body);
                cb(new Error("登录失败，请检查学号、密码和验证码。"));
            }
        });
    }
}
