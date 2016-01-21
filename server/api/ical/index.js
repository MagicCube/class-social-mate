import { Router } from "express";
import ical from "ical-generator";

import User from "../../../lib/model/user";

import courses from "../../../lib/course";

const router = Router();

router.get("/:id", (req, res) => {
    const userId = req.params.id;
    if (typeof(userId) !== "string" || userId.length !== 24)
    {
        res.status(403);
        res.end();
        return;
    }
    User.findById(userId, (err, user) => {
        if (err)
        {
            console.error(err);
        }
        if (user)
        {
            const courseIds = user.selectedCourseIds;
            const cal = ical({domain: "mba.coding.io", name: "南京大学 MBA 2016 选修课课表"});
            cal.prodId({
                company: "NJU MBA",
                product: "Henry Li",
                language: "ZH"
            });
            cal.url("https://mba.coding.io/api/ical/" + user.id);
            cal.timezone("Asia/Shanghai");

            courseIds.forEach(courseId => {
                const course = courses[courseId];
                const sessions = course.sessions;
                const events = [];
                sessions.forEach(session => {
                    const event = cal.createEvent({
                        summary: course.name,
                        start: session.startTime,
                        end: session.endTime,
                        location: course.room + " 教室"
                    });
                    event.createAlarm({type: "display", trigger: 5 * 60});
                    event.createAlarm({type: "display", trigger: 24 * 60 * 60});
                });
            });
            cal.serve(res);
        }
        else
        {
            res.status(404);
            res.end();
        }
    });
});

export default router;
