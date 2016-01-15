import serviceClient from "../service/service-client";

export default class SessionListView extends mx.View
{
    $ul = null;

    _sessions = null;

    constructor(id)
    {
        super(id);

        this.addClass("list").addClass("session-list");

        this.$ul = $("<ul/>");
        this.$container.append(this.$ul);
    }

    get sessions()
    {
        return this._sessions;
    }
    set sessions(sessions)
    {
        this._sessions = sessions;
        this.render();
    }

    render()
    {
        this.$ul.children().remove();
        let curDate = null;
        let $anchor = null;
        let now = new Date();
        this.sessions.forEach(session => {
            const course = serviceClient.courses[session.courseId];

            const $li = $("<li class=session>");
            $li.attr("id", session.id);

            const date = $format(session.startTime, "M月d日");
            if (curDate === null || curDate !== date)
            {
                curDate = date;
                const $dateLi = $("<li class='date group'>");
                $dateLi.attr("id", "date-" + date);
                $dateLi.text(date + " " + session.startTime.getLocaleDay());
                this.$ul.append($dateLi);
                $li.addClass("first-of-date");

                if ($anchor === null && session.startTime > now)
                {
                    $anchor = $dateLi;
                }
            }

            this.$ul.append($li);

            const $startTime = $("<span class='start time'>");
            $startTime.text($format(session.startTime, "HH:mm"));
            $li.append($startTime);
            const $endTime = $("<span class='end time'>");
            $endTime.text($format(session.endTime, "HH:mm"));
            $li.append($endTime);


            const $color = $("<div class=color>");
            $color.css("background-color", course.color);
            $li.append($color);


            const $info = $("<div class=info>")
            $li.append($info);

            const $name = $("<h1 class=name>");
            $name.text(course.name);
            if (course.name.length > 30)
            {
                $name.addClass("small");
            }
            $info.append($name);

            const $room = $("<span class=room>");
            $room.text(course.room + " 教室");
            $info.append($room);
        });

        if ($anchor)
        {
            setTimeout(() => {
                $anchor[0].scrollIntoView();
            });
        }
    }
}
