import View from "../view/view";

export default class Scene extends View
{
    _active = false;

    constructor(id)
    {
        super(id);
        this.addClass("mx-scene");
    }

    get isActive()
    {
        return this._active;
    }

    activate(args)
    {
        
    }

    _setActive(active)
    {
        this._active = active;
    }
}
