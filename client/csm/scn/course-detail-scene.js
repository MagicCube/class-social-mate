import serviceClient from "../service/service-client";

export default class CourseDetailScene extends mx.Scene
{
    _course = null;

    constructor()
    {
        super();
        this.addClass("course-detail");

        const $h1 = $("<h1>");
        this.$container.append($h1);
    }

    get course()
    {
        return this._course;
    }
    set course(course)
    {
        this._course = course;
        this.render();
    }

    activate(args)
    {
        this.course = serviceClient.courses[args.id];
    }


    render()
    {
        this.$("h1").text(this.course.name);
    }
}
