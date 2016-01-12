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
            cb(new Error("请输入验证码。"));
            return;
        }
        if (!schoolNum || schoolNum.trim() === "")
        {
            cb(new Error("请输入学号。"));
            return;
        }
        if (!password)
        {
            cb(new Error("请输入密码。"));
            return;
        }

        schoolNum = schoolNum.toUpperCase();
        if (schoolNum.indexOf("MF"))
        {
            cb(new Error("南京大学 MBA 学号必须以字母“MF”开头。"));
            return;
        }

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
                if (body.trim() !== "登录错误")
                {
                    this.schoolNum = schoolNum;
                    this._fetchElective(cb);
                }
                else
                {
                    cb(new Error("学号、密码或验证码输入不正确。"));
                }
            }
            else
            {
                cb(new Error("登陆失败，请检查学号、密码和验证码。"));
            }
        });
    }

    _fetchElective(cb)
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
                }
                cb();
            }
            else
            {
                cb(new Error("njubs.nju.edu.cn 站点没有返回正确信息。"));
            }
        });
    }
}