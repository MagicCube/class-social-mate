import TabPage from "./tab-page";

export default class TabControl extends mx.View
{
    constructor(id, pages)
    {
        super(id);

        this.addClass("tab-control");

        const $tabHeader = $("<header>");
        this.$element.append($tabHeader);
        this.$tabList = $("<ul/>");
        $tabHeader.append(this.$tabList);

        this.$container = $("<main/>");
        this.$element.append(this.$container);

        if (pages)
        {
            this.addSubviews(pages);
        }
    }

    addSubview(view)
    {
        if (view instanceof TabPage)
        {
            this.$tabList.append(view.$tabHeader);
            if (this.subviews.length === 1)
            {
                view.$tabHeader.addClass("active");
            }
        }
        view.hide();
        super.addSubview(view);
    }
}
