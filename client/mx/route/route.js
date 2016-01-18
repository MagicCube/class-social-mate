export default class Route
{
    _pattern = null;
    _keys = [];
    _regex = null;
    _handler = null;

    constructor(pattern, handler)
    {
        this._pattern = pattern;
        this._regex = Route.patternToRegex(this._pattern, this._keys, false, false);

        if (handler)
        {
            if (typeof(handler) === "function")
            {
                this._handler = handler;
            }
            else
            {
                throw new Error("handler must be a function.");
            }
        }
    }

    get pattern()
    {
        return this._pattern;
    }

    get keys()
    {
        return this._keys;
    }

    get regex()
    {
        return this._regex;
    }

    match(path)
    {
        const m = this._regex.exec(path);
        if (!m)
        {
            return null;
        }

        const params = [];
        for (let i = 1, len = m.length; i < len; ++i)
        {
            var key = this._keys[i - 1];
            var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];
            if (key) {
                params[key.name] = val;
            }
            params.push(val);
        }
        return params;
    }

    trigger(path, params)
    {
        if (typeof(this._handler) === "function")
        {
            const args = {
                route: this,
                path,
                params
            };
            this._handler(args);
        }
    }

    toUrl(params)
    {
        let path = this.pattern;
        for (let param in params)
        {
            path = path.replace('/:'+param, '/'+params[param]);
        }
        path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '').replace(/\/\*/, '/');
        return path;
    }



    static patternToRegex(path, keys, sensitive, strict)
    {
        if (path instanceof RegExp) return path;
        if (path instanceof Array) path = '(' + path.join('|') + ')';
        path = path
            .concat(strict ? '' : '/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/\+/g, '__plus__')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
                keys.push({ name: key, optional: !! optional });
                slash = slash || '';
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/__plus__/g, '(.+)')
            .replace(/\*/g, '(.*)');
        return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    }
}
