import TabView from "./tab-view";

import CalendarView from "../cal/calendar-view";

export default class CalendarTab extends TabView
{
    _calendarView = null;

    constructor()
    {
        super("calendarTab", {
            title: "日历",
            icon: "calendar"
        });
        this.addClass("calendar-tab");

        this._initCalendarView();
    }

    _initCalendarView()
    {
        this._calendarView = new CalendarView("calendar");
        this.addSubview(this._calendarView);
    }
}
