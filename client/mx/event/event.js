export default class Event
{
    _type = null;
    _listeners = null;

    constructor(type)
    {
        this._type = type;
        this._listeners = [];
    }

    get type()
    {
        return this._type;
    }

    get listeners()
    {
        return this._listeners;
    }

    trigger(source, args = {})
    {
        const e = $.extend(args, {
            type: this.type,
            source,
            defaultPrevented: false,
            preventDefault: function()
            {
                this.defaultPrevented = true;
            }
        });
        this.listeners.forEach(listener => {
            listener(e);
        });
        return e;
    }

    hasListener(listener)
    {
        if (typeof(listener) !== "function")
        {
            throw new Error("listener must be a function.");
        }
        return this.listeners.indexOf(listener) !== -1;
    }

    addListener(listener)
    {
        if (typeof(listener) !== "function")
        {
            throw new Error("listener must be a function.");
        }
        if (!this.hasListener(listener))
        {
            this.listeners.add(listener);
        }
    }

    removeListener(listener)
    {
        f (typeof(listener) !== "function")
        {
            throw new Error("listener must be a function.");
        }
        this.listeners.remove(listener);
    }

    clearListeners()
    {
        this.listeners.clear();
    }

    preventDefault()
    {
        this.defaultPrevented = true;
    }
}
