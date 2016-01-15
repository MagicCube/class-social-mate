export default class ListView extends mx.View
{
    $ul = null;
    _items = null;
    $itemTemplate = null;

    constructor(id)
    {
        super(id);

        this.addClass("list");

        this.$ul = $("<ul/>");
        this.$container.append(this.$ul);
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
        if (this.$itemTemplate === null)
        {
            this.$itemTemplate = this.getItemTemplate();
        }
        const $li = this.$itemTemplate.clone();
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
