import TabView from "./tab-view";

export default class TabControl extends mx.View
{
    _selection = null;

    _$header = null;
    _$tabList = null;

    constructor(id, tabs, selectedIndex)
    {
        super(id);

        this.addClass("tab-control");

        this._$header = $("<header>");
        this.$element.append(this._$header);
        this._$tabList = $("<ul/>");
        this._$header.append(this._$tabList);
        const hammer = new Hammer(this._$tabList[0], {
            recognizers: [
                [Hammer.Tap]
            ]
        });
        hammer.on("tap", e => {
            let $li = null;
            if (e.target.tagName === "SPAN")
            {
                $li = $(e.target.parentElement.parentElement);
            }
            else if (e.target.tagName === "A")
            {
                $li = $(e.target.parentElement);
            }
            else if (e.target.tagName === "LI")
            {
                $li = $(e.target);
            }
            if ($li)
            {
                this._tabListItem_onclick($li);
            }
        });

        this.$container = $("<main/>");
        this.$element.append(this.$container);

        if (tabs)
        {
            this.addSubviews(tabs);
        }
    }


    get tabs()
    {
        return this.subviews;
    }

    get selection()
    {
        return this._selection;
    }

    get selectedIndex()
    {
        return this.selection ? this.tabs.indexOf(this.selection) : -1;
    }

    set selectedIndex(index)
    {
        if (this.tabs[index] instanceof TabView)
        {
            this.select(index);
        }
    }


    addSubview(view)
    {
        if (!(view instanceof TabView))
        {
            throw new Error("TabControl only accept TabView as its subview.");
        }
        this._$tabList.append(view.$tabHeader);
        view.hide();
        super.addSubview(view);
    }

    select(tab)
    {
        if (typeof(tab) === "number" || typeof(tab) === "string")
        {
            tab = this.tabs[tab];
        }
        if (!(tab instanceof TabView))
        {
            throw new Error("tab must be a TabView(object, id or index).");
        }

        if (this.selection !== tab)
        {
            if (this.selection !== null)
            {
                this.selection.deactivate();
            }

            this._selection = tab;
            this.selection.activate();
        }
    }

    showHeader()
    {
        this._$header.show("fast");
    }

    hideHeader()
    {
        this._$header.hide("fast");
    }



    _tabListItem_onclick($li)
    {
        const tab = $li.data("tab");
        if (tab)
        {
            this.select(tab);
        }
    }
}
