import Route from "./route";

export default class Router
{
    _routes = [];
    _path = null;

    constructor()
    {

    }

    get path()
    {
        return this._path;
    }

    route(pattern, handler)
    {
        if (arguments.length !== 2)
        {
            throw new Error("route(pattern, handler) must have at least one argument.");
        }

        if (typeof(handler) === "function")
        {
            return this.registerRoute(pattern, handler);
        }
        else if (handler instanceof Router)
        {
            return this.use(pattern, handler);
        }
        else
        {
            throw new Error("The second argument of route(pattern, handler) must be a function or an instance of Router.");
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

        return this.registerRoute(pattern, context => {
            const url = context.route.toUrl(context.params);
            router.navigateTo(context.path.substr(url.length - 1));
        });
    }

    trigger(path)
    {
        for (let i = this._routes.length - 1; i >= 0; i--)
        {
            const route = this._routes[i];
            const params = route.match(path);
            if (params)
            {
                route.trigger(path, params);
                return true;
            }
        }
        return false;
    }

    navigateTo(path)
    {
        const result = this.trigger(path);
        if (result)
        {
            this._path = path;
        }
        else
        {
            console.warn(`Can not navigate to "${path}". No route found for it.`);
        }
        return result;
    }

    registerRoute(pattern, handler)
    {
        const route = new Route(pattern, handler);
        this._routes.push(route);
        return route;
    }
}
