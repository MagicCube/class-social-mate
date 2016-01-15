export default class CalendarView extends mx.View
{
    _date = null;
    _selection = null;

    _$table = null;

    constructor(id, date)
    {
        super(id);
        this.addClass("calendar");

        this._$table = this._initTable();
        this.$container.append(this._$table);

        if (date)
        {
            this.navigateTo(new Date());
        }
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
        if (this.date && this.date.getFullYear() === date.getFullYear() && this.date.getMonth() === date.getMonth())
        {
            this._date = date;
            return;
        }

        this._date = date;
        this.render();
    }

    select(date)
    {
        if (!(date instanceof Date))
        {
            throw new Error("date must be an instance of Date.");
        }
        this._selection = date;

        if (this.date && this.date.getFullYear() === date.getFullYear() && this.date.getMonth() === date.getMonth())
        {
            this.renderSelection(this._$table);
        }
    }

    navigateAndSelect(date)
    {
        this.navigateTo(date);
        this.select(date);
    }

    render()
    {
        this._renderTable(this._$table, this._date);
    }

    renderSelection($table)
    {
        $table.find(".active").removeClass("active");
        $table.find("#day-" + this.selection.getDate()).addClass("active");
    }



    _initTable()
    {
        const $table = $(`<table><caption/><thead><tr class=week ></tr></thead><tbody></tbody></table>`);
        this.$container.append($table);
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
            if (i === 5)
            {
                $row.hide();
            }
        }
        $table.find("tbody > tr > td > span").text("");
        $table.on("tap", "td", e => {
            const $cell = $(e.currentTarget);
            const date = new Date($table.data("year"), $table.data("month"), $cell.data("date"));
            this.select(date);
        });
        return $table;
    }

    _renderTable($table, date)
    {
        $table.attr("id", "month-" + date.getMonth());
        $table.data("month", date.getMonth());
        $table.data("year", date.getFullYear());
        $table.children("caption").text($format(date, "yyyy年M月"));
        $table.find("tbody > tr > td").attr("id", null);
        $table.find("tbody > tr > td > span").text("");
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
        $table.find(".row-6").toggle(row === 6);

        $table.find(".today").removeClass(".today");
        const today = new Date();
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth())
        {
            $table.find("#day-" + today.getDate()).addClass("today");
        }
    }
}
