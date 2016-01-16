export default class CalendarView extends mx.View
{
    onselectionchanged = null;

    _date = null;
    _selection = null;

    _minDate = new Date("2016-01-01");
    _maxDate = new Date("2016-08-01");

    _$tempalteTable = null;

    constructor(id, date)
    {
        super(id);
        this.addClass("calendar");

        if (date)
        {
            this.navigateTo(new Date());
        }

        const hammer = new Hammer(this.$element[0], {
            recognizers: [
                [Hammer.Tap]
            ]
        });
        hammer.on("tap", e => {
            const $cell = $(e.target).closest("td");
            if ($cell.length === 1)
            {
                if (typeof($cell.data("date")) !== "number")
                {
                    return;
                }
                const $table = $cell.closest("table");
                const date = new Date($table.data("year"), $table.data("month"), $cell.data("date"));
                this.select(date);
            }
        });
        /*
        this.$element.on("click", "td", e => {
            const $cell = $(e.currentTarget);
            if (typeof($cell.data("date")) !== "number")
            {
                return;
            }
            const $table = $cell.closest("table");
            const date = new Date($table.data("year"), $table.data("month"), $cell.data("date"));
            this.select(date);
        });
        */
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
        this._ensureMonths(7);

        setTimeout(() => {
            this.$("table#month-" + date.getMonth())[0].scrollIntoView();
        });
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






    _ensureMonths(months)
    {
        const $tables = this.$("table");
        if ($tables.length >= months)
        {
            return;
        }

        if (this._$tempalteTable === null)
        {
            this._$templateTable = this._createTable();
        }

        for (let i = $tables.length; i < months; i++)
        {
            const $table = this._$templateTable.clone();
            this.$container.append($table);
            this._renderTable($table, new Date(2016, i, 1));
        }
    }

    _createTable()
    {
        const $table = $(`<table><caption/><thead><tr class=week ></tr></thead><tbody></tbody></table>`);
        const $headerRow = $table.find("thead > tr");
        const $body = $table.children("tbody");
        ["一", "二", "三", "四", "五", "六", "日"].forEach((day, i) => {
            const $cell = $("<td><span/></td>");
            $cell.addClass("weekday-" + (i + 1));
            $cell.children("span").text(day);
            $headerRow.append($cell);
        });

        for (let i = 0; i < 6; i++)
        {
            const $row = $headerRow.clone();
            $row.addClass("row-" + (i + 1));
            $body.append($row);
        }
        $table.find("tbody > tr > td > span").text("");
        return $table;
    }

    _renderTable($table, date)
    {
        $table.attr("id", "month-" + date.getMonth());
        $table.data("month", date.getMonth());
        $table.data("year", date.getFullYear());
        $table.children("caption").text($format(date, "yyyy年M月"));
        $table.find("tbody > tr > td").attr("id", null);
        const firstDayOfDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const daysInMonth = Date.getDaysInMonth(date.getFullYear(), date.getMonth());
        let row = 1;
        let weekDay = firstDayOfDate.getDay();
        weekDay = (weekDay === 0 ? 7 : weekDay);
        let $row = $table.find(".row-1");
        for (let i = 0; i < daysInMonth; i++)
        {
            if (weekDay > 7)
            {
                weekDay = 1;
                row++;
                $row = $table.find(".row-" + row);
            }
            const $cell = $row.find(".weekday-" + weekDay);
            $cell.attr("id", "day-" + (i + 1));
            $cell.children("span").text(i + 1);
            $cell.data("date", i + 1);
            weekDay++;
        }

        const today = new Date();
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth())
        {
            $table.find("#day-" + today.getDate()).addClass("today");
        }
    }

    _renderSelection()
    {
        this.$(".active").removeClass("active");
        this.$("table#month-" + this.selection.getMonth() + " #day-" + this.selection.getDate()).addClass("active");
    }
}
