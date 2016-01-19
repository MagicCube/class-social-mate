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
        $li.children("a").attr("href", "#/course/" + course.id);

        $li.find(".tag").css("background-color", course.color);
        $li.find(".title").toggleClass("small", course.name.length > 30).text(course.name);
        $li.find(".room").text(course.room + " 教室");
        $li.find(".days").text(course.days.join(", "));
        $li.find(".session-left").text(course.sessionLeft > 0 ? ("剩余 " + course.sessionLeft + " 课时") : "已结课");

        return $li;
    }
}
