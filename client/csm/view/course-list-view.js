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
        });
    }
}
