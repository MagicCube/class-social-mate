import EventProvider from "../event/event-provider";

export default class Component extends EventProvider
{
    _id = "";
    _parent = null;

    constructor(...args)
    {
        super(...args);

        let id = null;
        let options = {};
        if (typeof(arguments[0]) === "string")
        {
            id = arguments[0];
            if ($.isPlainObject(arguments[1]))
            {
                options = arguments[1];
            }
        }
        else if ($.isPlainObject(arguments[0]))
        {
            options = arguments[0];

            if (options.id)
            {
                id = options.id;
                delete options.id;
            }
        }

        if (id !== null && typeof(id) !== "string")
        {
            throw new Error("Component's id must be a string.");
        }

        this._id = id;

        this.__init_options = options;

        this.initComponent();
    }




    get id()
    {
        return this._id;
    }

    get parent()
    {
        return this._parent;
    }



    initComponent()
    {
        this.applyOptions(this.__init_options);
        delete this.__init_options;
    }



    applyOptions(options)
    {
        if ($.isPlainObject(options))
        {
            for (let key in options)
            {
                this.applyOptionField(key, options[key]);
            }
        }
    }

    applyOptionField(name, value)
    {
        if (name.startsWith("on") && name.length > 2 && name === name.toLowerCase() && typeof(value) === "function")
        {
            this.on(name.substr(2), value);
        }
        else
        {
            this[name] = value;
        }
    }

    toString()
    {
        return this.constructor.name + (this.id ? "#" + this.id : "");
    }
}
