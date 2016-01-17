export default class MonthView extends mx.View
{
    _date = null;
    _$table = null;

    constructor(id, date = null)
    {
        super(id);
        this.addClass("month");
        this._initTable();
        if (date instanceof Date)
        {
            this.date = date;
        }
    }



    get date()
    {
        return this._date;
    }
    set date(date = null)
    {
        if (date !== null && !(date instanceof Date))
        {
            throw new Error("date must be an instance of Date.");
        }

        if (date !== null)
        {
            date = new Date(date.getFullYear(), date.getMonth(), 1);
        }

        if (this._date && date)
        {
            if (this._date.getFullYear() === date.getFullYear() && this._date.getMonth() === date.getMonth())
            {
                this._date = date;
                return;
            }
        }

        this._date = date;

        this.render();
    }


    _initTable()
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

        this.$container.append($table);
        this._$table = $table;
    }

    render()
    {
        const date = this.date;
        const $table = this._$table;
        if (date === null)
        {
            $table.hide();
            return;
        }
        $table.show();
        const $tbody = $table.children("tbody");

        // Reset
        $tbody.find("td").attr("id", null).data("date", null).removeClass("active today");
        $tbody.find("span").text("");

        $table.children("caption").text($format(date, "yyyy年M月"));

        const firstDayOfDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const daysInMonth = Date.getDaysInMonth(date.getFullYear(), date.getMonth());
        let row = 1;
        let weekDay = firstDayOfDate.getDay();
        weekDay = (weekDay === 0 ? 7 : weekDay);
        let $row = $tbody.find(".row-1");
        for (let i = 0; i < daysInMonth; i++)
        {
            if (weekDay > 7)
            {
                weekDay = 1;
                row++;
                $row = $table.find(".row-" + row);
            }
            const $cell = $row.find(".weekday-" + weekDay);
            $cell.children("span").text(i + 1);
            $cell.data("date", date.addDays(i));
            $cell.attr("id", "date-" + (i + 1));
            weekDay++;
        }

        const today = new Date();
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth())
        {
            $tbody.find("td#date-" + today.getDate()).addClass("today");
        }
    }
}
