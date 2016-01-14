import "../res/tab-control.less";

export default class TabPage extends mx.View
{
    _icon = null;
    _title = null;

    _$icon = null;
    _$label = null;

    constructor(id, { title = null, icon = null })
    {
        super(id);

        this.addClass("tab-page");
        this.initTabHeader();

        this.title = title;
        this.icon = icon;
    }

    initTabHeader()
    {
        this.$tabHeader = $("<li>");
        const $link = $("<a>");
        this.$tabHeader.append($link);

        this._$icon = $("<span class='icon glyphicon' />");
        $link.append(this._$icon);

        $link.append("<br/>");

        this._$label = $("<span class='title'/>");
        $link.append(this._$label);

        this.$tabHeader.on("click", this._tabHeader_onclick.bind(this));
    }




    get title()
    {
        return this._title;
    }
    set title(text)
    {
        this._title = text;
        this._$label.text(text);
    }

    get icon()
    {
        return this._icon;
    }
    set icon(icon)
    {
        this._icon = icon;
        this._$icon.addClass("glyphicon-" + icon);
    }



    _tabHeader_onclick()
    {
        console.log(this);
    }
}
