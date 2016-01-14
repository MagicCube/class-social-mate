import TabPage from "../tab/tab-page";

import CourseListView from "../view/course-list-view";

import serviceClient from "../service/service-client";

export default class CoursePage extends TabPage
{
    courseListView = null;

    constructor()
    {
        super("coursePage", {
            title: "课程",
            icon: "education"
        });
        this.addClass("course-page");

        this.initCourseListView();
    }

    initCourseListView()
    {
        this.courseListView = new CourseListView("courseList");
        this.addSubview(this.courseListView);
    }

    active()
    {
        super.active();
        if (this.courseListView.courses === null)
        {
            this.courseListView.courses = serviceClient.courses;
        }
    }
}
