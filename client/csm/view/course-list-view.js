import serviceClient from "../service/service-client";

export default class CourseListView extends mx.View
{
    $ul = null;

    _courses = null;

    constructor(id)
    {
        super(id);

        this.addClass("course-list");

        this.$ul = $("<ul/>");
        this.$container.append(this.$ul);
    }

    get courses()
    {
        return this._courses;
    }
    set courses(courses)
    {
        this._courses = courses;
        this.render();
    }

    render()
    {
        this.$ul.children().remove();
        this.courses.forEach(course => {
            const days = [];
            course.sessions.forEach(session => {
                const day = session.startTime.getLocaleDay();
                if (!days.contains(day))
                {
                    days.push(day);
                }
            });
            if (days.length === 1)
            {
                if (course.sessions[0].startTime.getHours() > 17)
                {
                    days[0] = days[0] + "晚";
                }
            }

            const $li = $("<li class=course>");
            this.$ul.append($li);

            const $color = $("<div class=color>");
            $color.css("background-color", course.color);
            $li.append($color);

            const $info = $("<div class=info>")
            $li.append($info);

            const $name = $("<span class=name>");
            $name.text(course.name);
            if (course.name.length > 30)
            {
                $name.addClass("small");
            }
            $info.append($name);

            const $room = $("<span class=room>");
            $room.text(course.room + " 教室");
            $info.append($room);

            const $days = $("<span class=days>");
            $days.text(days.join(", "));
            $info.append($days);
        });
    }
}
