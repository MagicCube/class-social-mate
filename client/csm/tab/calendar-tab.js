import TabView from "./tab-view";

export default class CalendarTab extends TabView
{
    constructor()
    {
        super("calendarTab", {
            title: "日历",
            icon: "calendar"
        });
        this.addClass("calendar-tab");
    }
}
