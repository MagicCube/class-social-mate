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
        if (this.id)
        {
            this.$tabHeader.attr("id", this.id);
        }
        this.$tabHeader.data("page", this);
        const $link = $("<a>");
        this.$tabHeader.append($link);

        this._$icon = $("<span class='icon glyphicon' />");
        $link.append(this._$icon);

        $link.append("<br/>");

        this._$label = $("<span class='title'/>");
        $link.append(this._$label);
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


    activate()
    {
        this.$tabHeader.addClass("active");
        this.$container.show();
    }

    deactivate()
    {
        this.$tabHeader.removeClass("active");
        this.$container.hide();
    }
}
