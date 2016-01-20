export default class ListView extends mx.View
{
    _items = null;

    _$ul = null;
    _$itemTemplate = null;

    onitemclick = null;

    constructor(id)
    {
        super(id);

        this.addClass("list");

        this._initUl();
        this._initHammer();
    }




    _initUl()
    {
        this._$ul = $("<ul/>");
        this.$container.append(this._$ul);
    }

    _initHammer()
    {
        const hammer = new Hammer(this.$ul[0], {
            recognizers: [
                [Hammer.Tap]
            ]
        });
        hammer.on("tap", e => {
            const $li = $(e.target).closest("li.item");
            if ($li.length === 1 && $li.parent().is(this.$ul))
            {
                const item = $li.data("item");
                this.trigger("itemclick", { item });
            }
        });
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

    get hasLoaded()
    {
        return this._hasLoaded;
    }

    load()
    {

    }

    _hasLoaded = false;
    loadOnce()
    {
        if (!this.hasLoaded)
        {
            this.load();
            this._hasLoaded = true;
        }
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
        $li.data("item", item);
        return $li;
    }

    getItemTemplate()
    {
        const $template = $(`<li class=item><a><div class=tag /><h1 class=title /></a></li>`);
        $template.children("a").append(this.getItemDescriptionTemplate());
        return $template;
    }

    getItemDescriptionTemplate()
    {
        const $template = $("<div class=desc />");
        return $template;
    }
}
