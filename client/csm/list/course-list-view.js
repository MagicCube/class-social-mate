import serviceClient from "../service/service-client";

import ListView from "./list-view";

export default class CourseListView extends ListView
{
    constructor(id)
    {
        super(id);

        this.addClass("course-list");
    }



    load()
    {
        this.items = serviceClient.courses;
    }




    getItemDescriptionTemplate()
    {
        const $desc = super.getItemDescriptionTemplate();
        $desc.append(`<div class=room /><div class=days /><div class=session-left />`);
        return $desc;
    }

    renderItem(course, i, context)
    {
        const $li = super.renderItem(course, i, context);
        $li.attr("id", course.id);

        let days = [];
        let sessionLeft = 0;
        course.sessions.forEach(session => {
            const day = session.startTime.getDay();
            if (!days.contains(day))
            {
                days.push(day);
            }
            if (Date.now() < session.startTime )
            {
                sessionLeft++;
            }
        });

        days.sort((a, b) => {
            if (a === 0)
            {
                a = 7;
            }
            if (b === 0)
            {
                b = 7;
            }
            return a - b;
        });

        days = days.map((day, i) => "周" + ["日", "一", "二", "三", "四", "五", "六"][day]);

        if (days.length === 1)
        {
            if (course.sessions[0].startTime.getHours() > 17)
            {
                days[0] = days[0] + "晚";
            }
        }

        $li.children(".tag").css("background-color", course.color);
        $li.children(".title").toggleClass("small", course.name.length > 30).text(course.name);
        $li.find(".room").text(course.room + " 教室");
        $li.find(".days").text(days.join(", "));
        $li.find(".session-left").text(sessionLeft > 0 ? ("剩余 " + sessionLeft + " 课时") : "已结课");

        return $li;
    }
}
