export default class Event
{
    constructor(type)
    {
        this.type = type;
        this.listeners = [];
        this.defaultPrevented = false;
    }

    trigger(source, args = {})
    {
        args.source = source;
        args.type = this.type;
        this.listeners.forEach(listener => {
            listener(args);
        });
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
