import TabPage from "./tab-page";

export default class TabControl extends mx.View
{
    _selection = null;

    constructor(id, pages)
    {
        super(id);

        this.addClass("tab-control");

        const $tabHeader = $("<header>");
        this.$element.append($tabHeader);
        this.$tabList = $("<ul/>");
        $tabHeader.append(this.$tabList);
        this.$tabList.on("click", "li", this._tabListItem_onclick.bind(this));

        this.$container = $("<main/>");
        this.$element.append(this.$container);

        if (pages)
        {
            this.addSubviews(pages);
        }
    }


    get selection()
    {
        return this._selection;
    }


    addSubview(view)
    {
        if (view instanceof TabPage)
        {
            this.$tabList.append(view.$tabHeader);
        }
        view.hide();
        super.addSubview(view);
    }

    select(page)
    {
        if (typeof(page) === "number" || typeof(page) === "string")
        {
            page = this.subviews[view];
        }
        if (!(page instanceof TabPage))
        {
            throw new Error("page must be a TabPage(object, id or index).");
        }

        if (this.selection !== page)
        {
            if (this.selection !== null)
            {
                this.selection.deactive();
            }

            this._selection = page;
            this.selection.active();
        }
    }



    _tabListItem_onclick(e)
    {
        const page = $(e.currentTarget).data("page");
        this.select(page);
    }
}
