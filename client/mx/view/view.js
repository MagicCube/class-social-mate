import Component from "../component/component";

export default class View extends Component
{
    _frame = null;

    $element = null;
    $container = null;

    constructor(id)
    {
        super(id);

        // Treat children as a READ-ONLY array.
        this._initSubviews();

        this.$element = $("<div>");
        this.$element.data("view", this);

        this.$container = this.$element;

        if (this.id)
        {
            this.$element.attr("id", this.id);
        }
    }


    _initSubviews()
    {
        this._subviews = {};
        this._subviews.length = Array.prototype.length;
        this._subviews.indexOf = Array.prototype.indexOf;
        this._subviews.contains = Array.prototype.contains;
        this._subviews.forEach = Array.prototype.forEach;
        this._subviews.map = Array.prototype.map;
        this._subviews.reduce = Array.prototype.reduce;
        this._subviews.clone = Array.prototype.clone;
        this._subviews.slice = Array.prototype.slice;
        this._subviews.splice = Array.prototype.splice;
    }




    get subviews()
    {
        return this._subviews;
    }
    set subviews(subviews)
    {
        this.clearSubviews();
        this.addSubviews(subviews);
    }

    get frame()
    {
        return this._frame;
    }
    set frame(frame)
    {
        this.setFrame(frame);
    }



    containsSubview(view)
    {
        return this.subviews.contains(view);
    }

    addSubview(view)
    {
        if (typeof(view) === "undefined" || view === null)
        {
            throw new Error("view can not be null or undfined.");
        }
        if (!(view instanceof View))
        {
            throw new Error("view must be an instance of View.");
        }

        if (view.parent !== null)
        {
            view.removeFromParent();
        }

        view._parent = this;
        Array.prototype.add.apply(this.subviews, [ view ]);

        view.placeAt(this.$container);
    }

    addSubviews(views)
    {
        if (typeof(views.forEach) !== "function")
        {
            throw new Error("views must at least have `forEach` function.");
        }
        views.forEach(view => {
            this.addSubview(view);
        });
    }

    removeSubview(view)
    {
        if (typeof(view) === "undefined" || view === null)
        {
            throw new Error("view can not be null or undfined.");
        }
        if (!(view instanceof View))
        {
            throw new Error("view must be an instance of View.");
        }

        view._parent = null;
        Array.prototype.removeAt.apply(this.subviews, [ this.subviews.indexOf(view) ]);

        view.$element.remove();
    }

    removeFromParent()
    {
        if (!this.parent)
        {
            throw new Error("parent can not be null.");
        }

        this.parent.removeSubview(this);
    }

    clearSubviews()
    {
        while (this.subviews.length > 0)
        {
            this.removeSubview(this.subviews[0]);
        }
    }




    placeAt(place)
    {
        if (place instanceof jQuery)
        {
            place.append(this.$element);
        }
        else
        {
            $(place).append(this.$element);
        }
    }



    setFrame(frame)
    {
        this._frame = frame;

        if (this.$element)
        {
            this.css(frame);

            if (notEmpty(frame.left) || notEmpty(frame.right) || notEmpty(frame.top) || notEmpty(frame.bottom))
            {
                this.css("position", "absolute");
            }
        }
    };





    $(...args)
    {
        return this.$element.find(...args);
    }

    addClass(...args)
    {
        return this.$element.addClass(...args);
    }

    removeClass(...args)
    {
        return this.$element.removeClass(...args);
    }

    toggleClass(...args)
    {
        return this.$element.toggleClass(...args);
    }

    show(...args)
    {
        return this.$element.show(...args);
    }

    hide(...args)
    {
        return this.$element.hide(...args);
    }

    fadeIn(...args)
    {
        return this.$element.fadeIn(...args);
    }

    fadeOut(...args)
    {
        return this.$element.fadeOut(...args);
    }

    animate(...args)
    {
        return this.$element.animate(...args);
    }

    transit(...args)
    {
        return this.$element.transit(...args);
    }

    transition(...args)
    {
        return this.$element.transition(...args);
    }

    css(...args)
    {
        return this.$element.css(...args);
    }

    offset(...args)
    {
        return this.$element.offset(...args);
    }
}