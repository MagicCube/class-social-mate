import serviceClient from "../service/service-client";

import SessionListView  from "../list/session-list-view";

export default class CourseDetailScene extends mx.Scene
{
    _course = null;

    _sessionListView = null;

    constructor()
    {
        super();
        this.addClass("course-detail");

        this._initHeader();
        this._initSessionListView();
    }

    _initHeader()
    {
        const $header = $("<header/>");
        $header.append(`
            <div class=tag />
            <h1 class=name />
            <div class=teachers />
            <div class=room />
            <div class=session-left />`);
        this.$container.append($header);
    }

    _initSessionListView()
    {
        this._sessionListView = new SessionListView("sessionList", true);
        this.addSubview(this._sessionListView);
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

    activate(course)
    {
        this.course = serviceClient.courses[course.id];
    }


    render()
    {
        this.$container.find(".tag").css("backgroundColor", this.course.color);
        this.$container.find(".name").text(this.course.name);
        this.$container.find(".room").text(this.course.room + " 教室");
        this.$container.find(".teachers").text(this.course.teachers.join(", "));
        this.$container.find(".session-left").text(this.course.sessionLeft > 0 ? ("剩余 " + this.course.sessionLeft + " 课时") : "已结课");

        this._sessionListView.items = this.course.sessions;
    }
}
