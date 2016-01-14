import TabPage from "../tab/tab-page";

export default class CalendarPage extends TabPage
{
    constructor()
    {
        super("calendarPage", {
            title: "日历",
            icon: "calendar"
        });
        this.addClass("calendar-page");
    }
}
