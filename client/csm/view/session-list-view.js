import serviceClient from "../service/service-client";

import ListView from "./list-view";

export default class SessionListView extends ListView
{
    constructor(id)
    {
        super(id);

        this.addClass("session-list");
    }

    getItemTemplate()
    {
        const $li = super.getItemTemplate();
        $li.append("<div class=time ><div class=start /><div class=end /></div>");
        return $li;
    }

    renderItem(session, i, context)
    {
        const $li = super.renderItem(session, i, context);
        const course = serviceClient.courses[session.courseId];
        $li.attr("id", session.id);
        const date = $format(session.startTime, "M月d日");
        if (context.date === null || context.date !== date)
        {
            context.date = date;
            const $dateLi = $("<li class='group'>");
            $dateLi.attr("id", "date-" + date);
            $dateLi.text(date + " " + session.startTime.getLocaleDay());
            this.$ul.append($dateLi);

            $li.addClass("first-of-date");

            if (context.$anchor === null && session.startTime > now)
            {
                context.$anchor = $dateLi;
            }
        }

        $li.children(".title").toggleClass("small", course.name.length > 30).text(course.name);
        $li.children(".tag").css("background-color", course.color);
        $li.find(".time > .start").text($format(session.startTime, "HH:mm"));
        $li.find(".time > .end").text($format(session.endTime, "HH:mm"));
        $li.children(".desc").text(course.room + " 教室");

        return $li;
    }

    render(context)
    {
        super.render(context);

        if (context.$anchor)
        {
            setTimeout(() => {
                context.$anchor[0].scrollIntoView();
            });
        }
    }
}
