import Route from "./route";
import Router from "./router";

class HashRouter extends Router
{
    constructor()
    {
        super();
        $(window).on("hashchange", this._window_onhashchange.bind(this));
    }

    get hash()
    {
        let hash = window.location.hash.replace(/^#/g, "").trim();
        if (hash === "")
        {
            hash = "/";
        }
        return hash;
    }

    route(pattern, handler)
    {
        if (arguments.length === 1 && typeof(pattern) === "string")
        {
            return this.navigateTo(pattern);
        }

        const route = super.route(pattern, handler);

        if (route.match(this.hash))
        {
            setTimeout(() => {
                this._path = this.hash;
                this.trigger(this.path);
            });
        }
        return route;
    }

    navigateTo(path)
    {
        if (path === this.path)
        {
            return true;
        }

        const result = this.trigger(path);
        if (result)
        {
            this._path = path;

            setTimeout(() => {
                if (path === "/")
                {
                    window.location.hash = "";
                }
                else
                {
                    window.location.hash = path;
                }
            });
        }
        else
        {
            console.warn(`Fail to navigate to "${path}". No route was found for this path.`);
        }
        return result;
    }

    _window_onhashchange(e)
    {
        this.navigateTo(this.hash);
    }
}


const router= new HashRouter();
export default router;
