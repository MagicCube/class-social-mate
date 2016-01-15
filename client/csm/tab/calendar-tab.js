import TabView from "./tab-view";

import CalendarView from "../cal/calendar-view";
import SessionListView from "../list/session-list-view";

import serviceClient from "../service/service-client";

export default class CalendarTab extends TabView
{
    _calendarView = null;
    _sessionListView = null;

    constructor()
    {
        super("calendarTab", {
            title: "日历",
            icon: "calendar"
        });
        this.addClass("calendar-tab");

        this._initCalendarView();
        this._initSessionView();
    }

    _initCalendarView()
    {
        this._calendarView = new CalendarView("calendar");
        this._calendarView.on("selectionchanged", _calendarView_onselectionchanged.bind(this));
        this.addSubview(this._calendarView);
    }

    _initSessionView()
    {
        this._sessionListView = new SessionListView("sessionList", true);
        this.addSubview(this._sessionListView);
    }

    activate()
    {
        super.activate();
        if (this._calendarView.date === null)
        {
            this._calendarView.css("paddingBottom", this._sessionListView.height() - 46);
            this._calendarView.navigateAndSelect(new Date());
        }
    }
}


function _calendarView_onselectionchanged(e)
{
    const sessions = serviceClient.querySessionsByDate(this._calendarView.selection);
    this._sessionListView.items = sessions;
}
