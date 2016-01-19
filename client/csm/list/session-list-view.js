import serviceClient from "../service/service-client";

import ListView from "./list-view";

export default class SessionListView extends ListView
{
    _grouped = false;

    constructor(id, grouped = false)
    {
        super(id);

        this._grouped = grouped;

        this.addClass("session-list");
    }

    get grouped()
    {
        return this._grouped;
    }



    load()
    {
        this.items = serviceClient.sessions;
    }

    queryByDate(date)
    {
        this.items = serviceClient.querySessionsByDate(date);
        if (this.grouped && this.items.length === 0)
        {
            this.appendGroup(date);
            this.$ul.append("<li class=no-session >没有课程安排</li>");
        }
    }




    getItemTemplate()
    {
        const $li = super.getItemTemplate();
        $li.children("a").append("<div class=time ><div class=start /><div class=end /></div>");
        return $li;
    }

    renderItem(session, i, context)
    {
        const $li = super.renderItem(session, i, context);
        const course = serviceClient.courses[session.courseId];
        $li.attr("id", session.id);
        const date = $format(session.startTime, "M月d日");
        if (this._grouped && (context.date === null || context.date !== date))
        {
            context.date = date;
            this.appendGroup(session.startTime);

            $li.addClass("first-of-date");

            if (context.$anchor === null && session.startTime > now)
            {
                context.$anchor = $dateLi;
            }
        }

        $li.find(".title").toggleClass("small", course.name.length > 30).text(course.name);
        $li.find(".tag").css("background-color", course.color);
        $li.find(".time > .start").text($format(session.startTime, "HH:mm"));
        $li.find(".time > .end").text($format(session.endTime, "HH:mm"));
        $li.find(".desc").text(course.room + " 教室");

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

    appendGroup(date)
    {
        const dateString = $format(date, "M月d日");
        const $dateLi = $("<li class='group'><a/></li>");
        $dateLi.attr("id", "date-" + dateString);
        $dateLi.children("a").text(dateString + " " + date.getLocaleDay());
        this.$ul.append($dateLi);
    }
}
