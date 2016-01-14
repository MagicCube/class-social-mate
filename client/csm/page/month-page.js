import TabPage from "../tab/tab-page";

export default class MonthPage extends TabPage
{
    constructor()
    {
        super("month", {
            title: "月",
            icon: "calendar"
        });
        this.addClass("month-page");
    }
}
