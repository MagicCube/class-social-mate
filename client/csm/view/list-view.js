export default class ListView extends mx.View
{
    _items = null;

    _$ul = null;
    _$itemTemplate = null;

    constructor(id)
    {
        super(id);

        this.addClass("list");

        this._$ul = $("<ul/>");
        this.$container.append(this._$ul);
    }

    get $ul()
    {
        return this._$ul;
    }

    get items()
    {
        return this._items;
    }
    set items(items)
    {
        this._items = items;
        const context = {};
        this.render(context);
    }

    render(context)
    {
        this.$ul.children().remove();

        this.items.forEach((item, i) => {
            const $li = this.renderItem(item, i, context);
            this.$ul.append($li);
        });
    }

    renderItem(item, i, context)
    {
        if (this._$itemTemplate === null)
        {
            this._$itemTemplate = this.getItemTemplate();
        }
        const $li = this._$itemTemplate.clone();
        return $li;
    }

    getItemTemplate()
    {
        const $template = $(`<li class=item><div class=tag /><h1 class=title /></li>`);
        $template.append(this.getItemDescriptionTemplate());
        return $template;
    }

    getItemDescriptionTemplate()
    {
        const $template = $("<div class=desc />");
        return $template;
    }
}
