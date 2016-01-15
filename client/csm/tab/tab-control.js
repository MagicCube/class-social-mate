import TabView from "./tab-view";

export default class TabControl extends mx.View
{
    _selection = null;

    constructor(id, tabs, selectedIndex)
    {
        super(id);

        this.addClass("tab-control");

        const $tabHeader = $("<header>");
        this.$element.append($tabHeader);
        this.$tabList = $("<ul/>");
        $tabHeader.append(this.$tabList);
        this.$tabList.on("tap", "li", this._tabListItem_onclick.bind(this));

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
        this.$tabList.append(view.$tabHeader);
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
        this.$tabHeader.show("fast");
    }

    hideHeader()
    {
        this.$tabHeader.hide("fast");
    }



    _tabListItem_onclick(e)
    {
        const tab = $(e.currentTarget).data("tab");
        this.select(tab);
    }
}
