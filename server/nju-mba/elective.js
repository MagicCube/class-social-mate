import cheerio from "cheerio";
import request from "request";

import courses from "../course/courses";
import User from "../model/user";

export default class Elective
{
    constructor({ auth })
    {
        this.auth = auth;
        this.selectedCourseIds = [];
    }

    loadSelectedCourses(cb)
    {
        request.get({
            url: "http://njubs.nju.edu.cn/mba/admin_index.php?admin=1120",
            headers: {
                "Origin": "http://njubs.nju.edu.cn",
                "Referer": "http://njubs.nju.edu.cn/mba/"
            },
            jar: this.auth.cookieJar
        }, (err, res, body) => {
            if (!err && res.statusCode === 200)
            {
                const $ = cheerio.load(body);
                this._loadFromPage($);
                cb();
            }
            else
            {
                cb(new Error("njubs.nju.edu.cn 站点没有返回正确信息。"));
            }
        });
    }

    save(cb)
    {
        User.findBySchoolNum(this.auth.schoolNum, (err, user) => {
            if (!user)
            {
                user = new User({
                    schoolNum: this.auth.schoolNum,
                    name: this.auth.name,
                });
            }
            user.set("selectedCourseIds", this.selectedCourseIds);
            user.save(err => {
                if (!err)
                {
                    cb();
                }
                else
                {
                    cb(err);
                }
            });
        });
    }

    _loadFromPage($)
    {
        const myCourses = [];
        $("#bodyadmin .lines:first-of-type li").each((i, li) => {
            const $li = $(li);
            const text = $li.text().trim();
            if (text.indexOf(`(${YEAR}${SCHOOL_TERM_CN})` === 0))
            {
                courses.forEach(course => {
                    if (text.indexOf(course.searchKey) !== -1)
                    {
                        this.selectedCourseIds.push(course.id);
                    }
                });
            }
        });
    }
}
