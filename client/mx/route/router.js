import Route from "./route";

export default class Router
{
    _routes = [];

    constructor()
    {

    }

    route(pattern, handler)
    {
        if (arguments.length === 0)
        {
            throw new Error("route() must have at least one argument.");
        }
        if (arguments.length === 2 && typeof(handler) === "function")
        {
            this._registerRoute(pattern, handler);
        }
        else if (arguments.length === 1)
        {
            const path = arguments[0];
            this._switchRoute(path);
        }
    }

    use(pattern, router)
    {
        if (arguments.length !== 2)
        {
            throw new Error("use(pattern, router) must have two argument.");
        }
        if (arguments[2] instanceof Router)
        {
            throw new Error("The second argument of use(pattern, router) must be an instance of Router.");
        }

        this._registerRoute(pattern, context => {
            const url = context.route.toUrl(context.params);
            router.route(context.path.substr(url.length - 1));
        });
    }

    _registerRoute(pattern, handler)
    {
        const route = new Route(pattern, handler);
        this._routes.push(route);
    }

    _switchRoute(path)
    {
        for (let i = 0; i < this._routes.length; i++)
        {
            const route = this._routes[i];
            const params = route.match(path);
            if (params)
            {
                route.trigger(path, params);
                return;
            }
        }
    }
}
