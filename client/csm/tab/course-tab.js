import TabView from "./tab-view";

import CourseListView from "../view/course-list-view";

import serviceClient from "../service/service-client";

export default class CourseTab extends TabView
{
    courseListView = null;

    constructor()
    {
        super("courseTab", {
            title: "课程",
            icon: "education"
        });
        this.addClass("course-tab");

        this.initCourseListView();
    }

    initCourseListView()
    {
        this.courseListView = new CourseListView("courseList");
        this.addSubview(this.courseListView);
    }

    activate()
    {
        super.activate();
        if (this.courseListView.items === null)
        {
            this.courseListView.items = serviceClient.courses;
        }
    }
}
