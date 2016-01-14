import TabPage from "../tab/tab-page";

export default class CoursePage extends TabPage
{
    constructor()
    {
        super("coursePage", {
            title: "课程",
            icon: "education"
        });
        this.addClass("course-page");
    }
}
