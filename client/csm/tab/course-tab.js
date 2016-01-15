import TabView from "./tab-view";

import CourseListView from "../list/course-list-view";

import serviceClient from "../service/service-client";

export default class CourseTab extends TabView
{
    _courseListView = null;

    constructor()
    {
        super("courseTab", {
            title: "课程",
            icon: "education"
        });
        this.addClass("course-tab");

        this._initCourseListView();
    }

    _initCourseListView()
    {
        this._courseListView = new CourseListView("courseList");
        this.addSubview(this._courseListView);
    }

    activate()
    {
        super.activate();
        if (this._courseListView.items === null)
        {
            this._courseListView.items = serviceClient.courses;
        }
    }
}
