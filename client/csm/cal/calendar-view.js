import MonthView from "./month-view";

export default class CalendarView extends mx.View
{
    _monthView = null;

    constructor(id)
    {
        super(id);
        this.addClass("calendar");

        this._initMonthView();
    }

    _initMonthView()
    {
        this._monthView = new MonthView("month");
        this.addSubview(this._monthView);
    }
}
