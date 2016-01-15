import TabPage from "./tab-page";

export default class TabControl extends mx.View
{
    _selection = null;

    constructor(id, pages, selectedIndex)
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

        if (pages)
        {
            this.addSubviews(pages);
        }
    }


    get pages()
    {
        return this.subviews;
    }

    get selection()
    {
        return this._selection;
    }

    get selectedIndex()
    {
        return this.selection ? this.pages.indexOf(this.selection) : -1;
    }

    set selectedIndex(index)
    {
        if (this.pages[index] instanceof TabPage)
        {
            this.select(index);
        }
    }


    addSubview(view)
    {
        if (!(view instanceof TabPage))
        {
            throw new Error("TabControl only accept TabPage as its subview.");
        }
        this.$tabList.append(view.$tabHeader);
        view.hide();
        super.addSubview(view);
    }

    select(page)
    {
        if (typeof(page) === "number" || typeof(page) === "string")
        {
            page = this.pages[page];
        }
        if (!(page instanceof TabPage))
        {
            throw new Error("page must be a TabPage(object, id or index).");
        }

        if (this.selection !== page)
        {
            if (this.selection !== null)
            {
                this.selection.deactivate();
            }

            this._selection = page;
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
        const page = $(e.currentTarget).data("page");
        this.select(page);
    }
}
