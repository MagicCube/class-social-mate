import Event from "./event";

export default class EventProvider
{
    getEvent(eventType)
    {
        if (this.hasEvent(eventType))
        {
            if (this["on" + eventType] === null)
            {
                this["on" + eventType] = new Event(eventType);
            }
            return this["on" + eventType];
        }
        else
        {
            return null;
        }
    }

    hasEvent(eventType)
    {
        if (typeof(eventType) !== "string")
        {
            throw new Error("eventType must be a string.");
        }
        return this["on" + eventType] instanceof Event || this["on" + eventType] === null;
    }

    on(eventType, listener)
    {
        const e = this.getEvent(eventType);
        if (e)
        {
            e.addListener(listener);
        }
        else
        {
            throw new Error(`"${eventType}" event is not found.`);
        }
    }

    off(eventType, listener = null)
    {
        const e = this.getEvent(eventType);
        if (e)
        {
            if (listener !== null)
            {
                e.removeListener(listener);
            }
            else
            {
                e.clearListeners();
            }
        }
        else
        {
            throw new Error(`"${eventType}" event is not found.`);
        }
    }

    trigger(eventType, args = {})
    {
        const e = this.getEvent(eventType);
        if (e)
        {
            e.trigger(this, args);
        }
        else
        {
            throw new Error(`"${eventType}" event is not found.`);
        }
    }
}
