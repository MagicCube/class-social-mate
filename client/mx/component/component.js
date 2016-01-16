import EventProvider from "../event/event-provider";

export default class Component extends EventProvider
{
    _id = null;
    _parent = null;

    constructor(id = null)
    {
        super();

        if (id !== null && typeof(id) !== "string")
        {
            throw new Error("Component's id must be a string.");
        }

        if (id)
        {
            this.setId(id);
        }
    }



    get id()
    {
        return this._id;
    }
    setId(id)
    {
        if (typeof(id) !== "string")
        {
            throw new Error("id must be a string.");
        }
        this._id = id;
    }

    get parent()
    {
        return this._parent;
    }



    toString()
    {
        return this.constructor.name + (this.id ? "#" + this.id : "");
    }
}
