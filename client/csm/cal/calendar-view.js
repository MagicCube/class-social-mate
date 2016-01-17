import MonthView from "./month-view";

export default class CalendarView extends mx.View
{
    onselectionchanged = null;

    _date = null;
    _selection = null;

    _minDate = new Date("2016-01-01");
    _maxDate = new Date("2016-07-31");

    _monthView = null;
    _monthViewLeft = null;
    _monthViewRight = null;

    _panning = false;

    constructor(id, date)
    {
        super(id);
        this.addClass("calendar");

        if (date)
        {
            this.navigateTo(new Date());
        }

        this.$container = $("<div class=calendar-container />");
        this.$element.append(this.$container);

        this._initMonthViews();
        this._initHammer();
    }

    _initMonthViews()
    {
        this._monthView = new MonthView();
        this._monthView.addClass("middle");
        this.addSubview(this._monthView);

        this._monthViewLeft = new MonthView();
        this._monthViewLeft.addClass("left");
        this.addSubview(this._monthViewLeft);

        this._monthViewRight = new MonthView();
        this._monthViewRight.addClass("right");
        this.addSubview(this._monthViewRight);
    }

    _initHammer()
    {
        const hammer = new Hammer(this.$element[0], {
            recognizers: [
                [Hammer.Tap],
                [Hammer.Pinch, { enable: false }],
                [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]
            ]
        });
        hammer.on("panstart", e => {
            if (this._panning)
            {
                return;
            }
            this._panning = true;
            let x = 0;
            const translate = this._monthView.css("translate");
            if (translate)
            {
                x = parseInt(translate);
            }
            const panState = { initialX: x, x };
            hammer.on("panmove", e => {
                e.preventDefault();
                let x = e.deltaX + panState.initialX;
                if (this.date.getMonth() === this._minDate.getMonth() && x > 0)
                {
                    x = Math.sqrt(e.deltaX * 20) + panState.initialX
                }
                if (this.date.getMonth() === this._maxDate.getMonth() && x < 0)
                {
                    x = -Math.sqrt(Math.abs(e.deltaX) * 20) + panState.initialX
                }
                panState.x = x;
                this.$container.css({ x });
            });
            hammer.on("panend", e => {
                e.preventDefault();
                hammer.off("panend");
                hammer.off("panmove");
                let x = panState.x;
                if (x > this.width() / 5)
                {
                    x = this.width();
                }
                else if (x < -this.width() / 5)
                {
                    x = -this.width();
                }
                else
                {
                    x = 0;
                }

                let duration = e.deltaTime;
                if (duration < 200)
                {
                    duration = 200;
                }
                else if (duration > 1000)
                {
                    duration = 1000;
                }


                this.$container.transit({ x }, duration, () => {
                    if (x !== 0)
                    {
                        this.$container.css({ x: 0 });

                        const original = {
                            center: this._monthView,
                            right: this._monthViewRight,
                            left: this._monthViewLeft
                        };

                        if (x < 0)
                        {
                            this._monthView.removeClass("middle").addClass("left");
                            this._monthViewRight.removeClass("right").addClass("middle");
                            this._monthViewLeft.removeClass("left").addClass("right");

                            this._monthView = original.right;
                            this._monthViewLeft = original.center;
                            this._monthViewRight = original.left;
                        }
                        else if (x > 0)
                        {
                            this._monthView.removeClass("middle").addClass("right");
                            this._monthViewLeft.removeClass("left").addClass("middle");
                            this._monthViewRight.removeClass("right").addClass("left");

                            this._monthView = original.left;
                            this._monthViewRight = original.center;
                            this._monthViewLeft = original.right;
                        }

                        const now = new Date();
                        if (now.getFullYear() === this._monthView.date.getFullYear() && now.getMonth() === this._monthView.date.getMonth())
                        {
                            this.navigateAndSelect(now);
                        }
                        else
                        {
                            this.navigateAndSelect(this._monthView.date);
                        }
                    }
                    this._panning = false;
                });
            });
        });

        hammer.on("tap", e => {
            const $cell = $(e.target).closest("td");
            if ($cell.length === 1)
            {
                const date = $cell.data("date");
                if (date instanceof Date)
                {
                    this.select(date);
                }
            }
        });
    }



    get date()
    {
        return this._date;
    }
    set date(date)
    {
        this.navigateTo(date);
    }

    get selection()
    {
        return this._selection;
    }
    set selection(selection)
    {
        this.select(date);
    }

    navigateTo(date)
    {
        if (!(date instanceof Date))
        {
            throw new Error("date must be an instance of Date.");
        }
        if (date > this._maxDate)
        {
            date = this._maxDate;
        }
        else if (date < this._minDate)
        {
            date  = this._minDate;
        }
        if (this.date && this.date.getFullYear() === date.getFullYear() && this.date.getMonth() === date.getMonth())
        {
            this._date = date;
            return;
        }

        this._date = date;
        this._monthView.date = date;

        const lastMonth = date.addMonths(-1);
        this._monthViewLeft.date = lastMonth;
        const nextMonth = date.addMonths(1);
        this._monthViewRight.date = nextMonth;
    }

    select(date)
    {
        if (!(date instanceof Date))
        {
            throw new Error("date must be an instance of Date.");
        }
        if (date > this._maxDate)
        {
            date = this._maxDate;
        }
        else if (date < this._minDate)
        {
            date  = this._minDate;
        }
        this._selection = date;
        this._renderSelection();
        this.trigger("selectionchanged");
    }

    navigateAndSelect(date)
    {
        this.navigateTo(date);
        this.select(date);
    }



    _renderSelection()
    {
        this._monthView.$(".active").removeClass("active");
        this._monthViewLeft.$(".active").removeClass("active");
        this._monthViewRight.$(".active").removeClass("active");
        this._monthView.$("#date-" + this.selection.getDate()).addClass("active");
    }
}
