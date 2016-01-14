// 判断类型

function isBoolean(p_value)
{
    return typeof (p_value) === "boolean";
}

function isString(p_value)
{
    return typeof (p_value) === "string";
}

function isNumber(p_value)
{
    return typeof (p_value) === "number";
}

function isDate(p_value)
{
    return notEmpty(p_value) && p_value.constructor === Date;
}

function isArray(p_value)
{
    if (typeof(Array.isArray) === "function")
    {
        return Array.isArray(p_value);
    }
    else
    {
        return notEmpty(p_value) && (typeof (p_value) === "object" && typeof (p_value.length) === "number");
    }
}

function isObject(p_value)
{
    return notEmpty(p_value) && typeof (p_value) === "object";
}

function isPlainObject(p_value)
{
    return $.isPlainObject(p_value);
}

function isFunction(p_value)
{
    return typeof (p_value) === "function";
}

function isClass(p_value)
{
    return typeof (p_value) === "function";
}

// 类型转换
function parseBoolean(p_text)
{
    if (typeof (p_text) === "boolean")
    {
        return p_text;
    }
    else if (typeof(p_text) === "number")
    {
        return p_text !== 0;
    }
    else if (typeof(p_text) === "string")
    {
        var t = p_text.toLowerCase();
        return (t === "true") || (t === "t");
    }
}

var __regex_Hms = /^(\S*):(\S*):(\S*)$/;
var __regex_Hm = /^(\S*):(\S*)$/;
function parseTimeString(p_timeString)
{
    var value = {
        hours : 0,
        minutes : 0,
        seconds : 0
    };

    var matches = p_timeString.match(__regex_Hms);
    if (isEmpty(matches))
    {
        matches = p_timeString.match(__regex_Hm);
        if (isEmpty(matches))
        {
            matches = [p_timeString, p_timeString];
        }
    }

    if (matches.length >= 2)
    {
        value.hours = parseInt(matches[1], 10);
        if (isNaN(value.hours) || value.hours > 23 || value.hours < 0)
        {
            value.hours = 0;
        }
    }

    if (matches.length >= 3)
    {
        value.minutes = parseInt(matches[2], 10);
        if (isNaN(value.minutes) || value.minutes > 60 || value.minutes < 0)
        {
            value.minutes = 0;
        }
    }

    if (matches.length >= 4)
    {
        value.seconds = parseInt(matches[3], 10);
        if (isNaN(value.seconds) || value.seconds > 60 || value.seconds < 0)
        {
            value.seconds = 0;
        }
    }

    return value;
}

var __regex_yyyyM = /^(\S*)-(\S*)$/;
var __regex_yyyyMD = /^(\S*)-(\S*)-(\S*)$/;
function parseDateString(p_dateString)
{
    var value = {
        year : 1900,
        month : 1,
        date : 1
    };

    var matches = p_dateString.match(__regex_yyyyMD);
    if (isEmpty(matches))
    {
        matches = p_dateString.match(__regex_yyyyM);
        if (isEmpty(matches))
        {
            matches = [p_dateString, p_dateString];
        }
    }
    if (notEmpty(matches))
    {
        if (matches.length >= 2)
        {
            value.year = parseInt(matches[1], 10);
            if (isNaN(value.year))
            {
                value.year = 1900;
            }
        }

        if (matches.length >= 3)
        {
            value.month = parseInt(matches[2], 10);
            if (isNaN(value.month) || value.month > 12 || value.month <= 0)
            {
                value.month = 1;
            }
        }

        if (matches.length >= 4)
        {
            var d_max = Date.getDaysInMonth(value.year, value.month - 1);
            value.date = parseInt(matches[3], 10);
            if (isNaN(value.date) || value.date <= 0)
            {
                value.date = 1;
            }
            else if (value.date > d_max)
            {
                value.date = d_max;
            }
        }
    }
    value.month -= 1;
    return value;
}

function parseDate(p_text)
{
    if (isEmpty(p_text))
    {
        return null;
    }
    if (isDate(p_text))
    {
        return p_text;
    }

    var parts = null;
    var datePart = null;
    var timePart = null;
    p_text = p_text.trim();
    if (p_text.indexOf(" ") !== -1)
    {
        parts = p_text.split(" ");
    }
    else if (p_text.indexOf("T") !== -1)
    {
        parts = p_text.split("T");
    }

    if (isEmpty(parts))
    {
        parts = [p_text];
    }

    if (parts.length === 1)
    {
        if (parts[0].indexOf(":") !== -1)
        {
            timePart = parts[0];
        }
        else
        {
            datePart = parts[0];
        }
    }
    else if (parts.length === 2)
    {
        datePart = parts[0];
        timePart = parts[1];
    }

    var dateValue = {
        year : 1900,
        month : 0,
        date : 1
    };
    if (notEmpty(datePart))
    {
        dateValue = parseDateString(datePart);
    }

    var timeValue = {
        hours : 0,
        minutes : 0,
        seconds : 0
    };
    if (notEmpty(timePart))
    {
        timeValue = parseTimeString(timePart);
    }

    return new Date(dateValue.year, dateValue.month, dateValue.date, timeValue.hours, timeValue.minutes, timeValue.seconds);
}

// 命名空间
function $namespace(p_namespace)
{
    if (!/^[a-z]+[a-z0-9\._\$]*[a-z0-9]$/.test(p_namespace))
    {
        throw new Error("Invalid namespace '" + p_namespace + "'.");
    }
    var parts = p_namespace.split(".");
    if (parts.length === 0)
    {
        return null;
    }

    var partialNS = null;
    var context = window;
    for (var i = 0; i < parts.length; i++)
    {
        partialNS = parts[i];
        if (isEmpty(context[partialNS]))
        {
            context[partialNS] = {};
        }
        context = context[partialNS];
    }
    return context;
}

// 继承
function $extend(p_baseClass)
{
    if (typeof (p_baseClass) === "function")
    {
        var inst = new p_baseClass();
        inst.__class__ = $extend.caller;
        if (p_baseClass !== MXObject && p_baseClass !== MXComponent)
        {
            inst.__superClasses__.push(p_baseClass);
        }
        return inst;
    }
}

// 获取实例的类型。
function $getclass(p_inst)
{
    if (isEmpty(p_inst))
    {
        return null;
    }
    switch (typeof (p_inst))
    {
        case "boolean":
            return Boolean;

        case "number":
            return Number;

        case "string":
            return String;

        case "function":
            return Function;

        case "object":
            if (typeof (p_inst.getClass) === "function")
            {
                return p_inst.getClass();
            }
            else if (isDate(p_inst))
            {
                return Date;
            }
            else if (isArray(p_inst))
            {
                return Array;
            }
            else
            {
                return Object;
            }
            break;
        default:
            return null;
    }
}

// 判断 p_inst 是否是 p_class 的实例。
function $instanceof(p_inst, p_class)
{
    if (isEmpty(p_inst))
    {
        return false;
    }
    switch (typeof (p_inst))
    {
        case "boolean":
            return p_class === Boolean;

        case "number":
            return p_class === Number;

        case "string":
            return p_class === String;

        case "function":
            return p_class === Function;

        case "object":
            if (typeof (p_inst.instanceOf) === "function")
            {
                return p_inst.instanceOf(p_class);
            }
            else if (isDate(p_inst))
            {
                return p_class === Date;
            }
            else if (isArray(p_inst))
            {
                return p_class === Array;
            }
            else
            {
                return true;
            }
            break;
        default:
            return false;
    }
}


function isEmpty(p_value)
{
    return p_value === undefined || p_value === null;
}

function notEmpty(p_value)
{
    return !isEmpty(p_value);
}

global.$format = function(p_value, p_format)
{
    if (isString(p_value) && (isArray(p_format) || isNumber(p_format) || isPlainObject(p_format)))
    {
        return String.format(p_value, p_format);
    }
    if (isNumber(p_value))
    {
        return Number.format(p_value, p_format);
    }
    else if (isDate(p_value))
    {
        return Date.format(p_value, p_format);
    }
    else
    {
        return notEmpty(p_value) ? p_value.toString() : "";
    }
}

//=====================================================================
//Boolean
//=====================================================================

//=====================================================================
//String
//=====================================================================

String.format = function(p_string, p_args)
{
    if (isEmpty(p_string))
    {
        return "";
    }
    if (typeof (p_string) !== "string")
    {
        p_string = p_string.toString();
    }
    if (isEmpty(p_args))
    {
        return p_string;
    }

    var result = null;
    var key = null;
    var value = null;
    var i = 0;
    if (typeof (p_args) === "number")
    {
        result = [];
        for (i = 0; i < p_args; i++)
        {
            result[i] = p_string;
        }
        return result.join("");
    }

    result = p_string;
    var groups = null;
    if (p_string.indexOf("{") !== -1 && p_string.indexOf("}") !== -1)
    {
        if (isObject(p_args) && !Array.isArray(p_args))
        {
            groups = p_string.match(/(\{[a-z][a-z$_0-9]*\})/gi);
            if (notEmpty(groups))
            {
                for (i = 0; i < groups.length; i++)
                {
                    key = groups[i].substr(1);
                    key = key.substr(0, key.length - 1);
                    value = p_args[key];
                    if (isEmpty(value))
                    {
                        value = "";
                    }
                    result = result.replace("{" + key + "}", value);
                }
            }
        }
        else if (Array.isArray(p_args))
        {
            groups = p_string.match(/(\{[0-9]+\})/gi);
            if (notEmpty(groups))
            {
                for (i = 0; i < groups.length; i++)
                {
                    var index = groups[i].substr(1);
                    index = index.substr(0, index.length - 1);
                    value = p_args[parseInt(index, 0)];
                    if (isEmpty(value))
                    {
                        value = "";
                    }
                    result = result.replace("{" + index + "}", value);
                }
            }
        }
    }
    return result;
};

String.newGuid = function(p_toLowerCase, p_length)
{
    var toLowerCase = false;
    if (notEmpty(p_toLowerCase))
    {
        toLowerCase = p_toLowerCase;
    }
    var length = 32;
    if (notEmpty(p_length))
    {
        length = p_length;
    }
    var result = "";
    for (var i = 1; i <= length; i++)
    {
        var n = Math.floor(Math.random() * 16.0);
        if (n < 10)
        {
            result += n;
        }
        else if (n === 10)
        {
            result += "a";
        }
        else if (n === 11)
        {
            result += "b";
        }
        else if (n === 12)
        {
            result += "c";
        }
        else if (n === 13)
        {
            result += "d";
        }
        else if (n === 14)
        {
            result += "e";
        }
        else if (n === 15)
        {
            result += "f";
        }
        if ((i === 8) || (i === 12) || (i === 16) || (i === 20))
        {
            result += "-";
        }
    }

    if (toLowerCase)
    {
        result = result.toLowerCase();
    }
    else
    {
        result = result.toUpperCase();
    }
    return result;
};

String.prototype.contains = function(p_subString)
{
    return this.indexOf(p_subString) !== -1;
};

String.prototype.startsWith = function(p_string)
{
    return this.substring(0, p_string.length) === p_string;
};

String.prototype.endsWith = function(p_string)
{
    return this.substring(this.length - p_string.length) === p_string;
};

String.prototype.trimLeft = function()
{
    return this.replace(/^\s*/, "");
};

String.prototype.trimRight = function()
{
    return this.replace(/\s*$/, "");
};

String.prototype.trim = function()
{
    return this.trimRight().trimLeft();
};

String.prototype.getByteCount = function()
{
    var text = this.replace(/[^\x00-\xff]/g, "**");
    return text.length;
};

String.prototype.containsAsianCharacters = function()
{
    return (/.*[\u4e00-\u9fa5]+.*$/.test(this));
};

String.prototype.toUpperCamelCase = function()
{
    return this[0].toUpperCase() + this.substr(1);
};

// =====================================================================
// Number
// =====================================================================

Number.format = function(p_value, p_formatString)
{
    if (isEmpty(p_value))
    {
        return "";
    }
    if (typeof (p_formatString) === "undefiend")
    {
        return p_value + "";
    }
    if (!isNumber(p_value))
    {
        p_value = 0;
    }

    var percentage = "";
    if (p_formatString.endsWith("%") && p_formatString.length > 1)
    {
        percentage = "%";
        p_value = p_value * 100;
        p_formatString = p_formatString.substr(0, p_formatString.length - 1);
    }

    var string = p_value + "";
    if (notEmpty(p_formatString) && p_formatString !== "")
    {
        var stringParts = string.split('.');
        var formatParts = p_formatString.split('.');

        if (!formatParts[0].endsWith(",000") && stringParts[0].length < formatParts[0].length)
        {
            stringParts[0] = formatParts[0].substring(0, formatParts[0].length - stringParts[0].length) + stringParts[0];
        }

        if (formatParts[0].endsWith(",000"))
        {
            stringParts[0] = stringParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        if (formatParts.length === 1)
        {
            return stringParts[0] + percentage;
        }
        else
        {
            var fl = parseFloat("0." + stringParts[1]);
            fl = fl.toFixed(formatParts[1].length);
            return stringParts[0] + "." + fl.substr(2) + percentage;
        }
    }
    else
    {
        return string;
    }
};

// =====================================================================
// Date
// =====================================================================

Date.today = new Date();
Date.today = new Date(Date.today.getFullYear(), Date.today.getMonth(), Date.today.getDate());
Date.format = function(p_value, p_formatString)
{
    if (notEmpty(p_value))
    {
        var text;
        if (!p_formatString)
        {
            text = "yyyy-MM-dd HH:mm:ss";
        }
        else if (p_formatString === "smart")
        {
            var result = null;
            var now = new Date();
            var deltaMin = Math.round((now.getTime() - p_value) / 1000 / 60);
            if (deltaMin <= 0)
            {
                result = "刚刚";
            }
            else if (deltaMin <= 1)
            {
                result = Math.round((now.getTime() - p_value) / 1000) + " 秒种前";
            }
            else if (deltaMin < 60)
            {
                result = deltaMin + " 分钟前";
            }
            else if (deltaMin === 60)
            {
                result = "1 小时前";
            }
            else
            {
                var deltaHour = Math.round(deltaMin / 60);
                if (deltaHour < 24)
                {
                    result = deltaHour + " 小时前";
                }
                else if (deltaHour === 24)
                {
                    result = "1 天前";
                }
                else
                {
                    var deltaDay = Math.round(deltaHour / 24);
                    if (deltaDay < 8)
                    {
                        result = deltaDay + " 天前";
                    }
                }
            }
            if (notEmpty(result))
            {
                return result;
            }
            else
            {
                text = "yyyy年M月d日";
            }
        }
        else
        {
            text = p_formatString;
        }

        var yy = p_value.getYear();
        var M = p_value.getMonth() + 1;
        var d = p_value.getDate();
        var h = p_value.getHours();
        if (h > 12)
        {
            h = p_value.getHours() % 12;
        }
        var H = p_value.getHours();
        var m = p_value.getMinutes();
        var s = p_value.getSeconds();

        var yyyy = p_value.getFullYear();
        var MM = Number.format(M, "00");
        var dd = Number.format(d, "00");
        var hh = Number.format(h, "00");
        var HH = Number.format(H, "00");
        var mm = Number.format(m, "00");
        var ss = Number.format(s, "00");

        text = text.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
        text = text.replace("HH", HH).replace("hh", hh).replace("mm", mm).replace("ss", ss);
        text = text.replace("yy", yy).replace("M", M).replace("d", d);
        text = text.replace("H", H).replace("h", h).replace("m", m).replace("s", s);

        return text;
    }
    else
    {
        return "";
    }
};

Date.getDaysInMonth = function(p_year, p_month)
{
    switch (p_month + 1)
    {
        case 2:
            if ((p_year % 400 === 0) || (p_year % 4 === 0) && (p_year % 100 !== 0))
            {
                return 29;
            }
            else
            {
                return 28;
            }
            break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        default:
            return 30;
    }
};

Date.prototype.getLocaleDay = function()
{
    return "周" + ["日", "一", "二", "三", "四", "五", "六"][this.getDay()];
};

Date.prototype.addMilliSecond = function(p_ms)
{
    var ms = this * 1 + p_ms;
    var date = new Date(ms);
    return date;
};

Date.prototype.addSeconds = function(p_seconds)
{
    var ms = this * 1 + p_seconds * 1000;
    var date = new Date(ms);
    return date;
};

Date.prototype.addMinutes = function(p_minutes)
{
    return this.addSeconds(p_minutes * 60);
};

Date.prototype.addHours = function(p_hours)
{
    return this.addMinutes(p_hours * 60);
};

Date.prototype.addDays = function(p_days)
{
    return this.addHours(p_days * 24);
};

Date.prototype.addWeeks = function(p_weeks)
{
    return this.addDays(p_weeks * 7);
};

Date.prototype.addMonths = function(p_months)
{
    var copy = new Date(this * 1);
    var months = copy.getMonth() + 1 + p_months;

    var years = Math.floor(months / 12);

    var year = copy.getFullYear() + years;
    var month = Math.abs(years * 12 - months) % 12;
    var date = copy.getDate();
    var daysInMonth = Date.getDaysInMonth(year, month - 1);

    if (date > daysInMonth)
    {
        date = daysInMonth;
    }

    copy.setDate(1);
    copy.setFullYear(year);
    copy.setMonth(month - 1);
    copy.setDate(date);

    return copy;
};

Date.prototype.addYears = function(p_years)
{
    var copy = this.addMonths(p_years * 12);
    return copy;
};

Date.prototype.equals = function(p_date)
{
    return this.compare(p_date) === 0;
};

Date.prototype.compare = function(p_date)
{
    if (isEmpty(p_date))
    {
        return -1;
    }

    if (p_date.constructor !== Date)
    {
        return -1;
    }

    return p_date * 1 - this * 1;
};

Date.prototype.clone = function()
{
    var date = new Date(this * 1);
    return date;
};

// =====================================================================
// Array
// =====================================================================

Array.prototype.enqueue = function(item)
{
    this.push(item);
};

Array.prototype.dequeue = function()
{
    if (this.length === 0)
    {
        return undefined;
    }

    var item = this[0];
    this.removeAt(0);
    return item;
};

Array.prototype.peek = function()
{
    return (this.length > 0 ? this[0] : undefined);
};

Array.prototype.indexOf = function(p_item)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] === p_item)
        {
            return i;
        }
    }
    return -1;
};

Array.prototype.first = function(i)
{
    if (this.length === 0)
    {
        return undefined;
    }

    if (typeof (i) !== "number")
    {
        i = 0;
    }
    if (i >= this.length)
    {
        i = this.length - 1;
    }
    return this[i];
};

Array.prototype.last = function(i)
{
    if (this.length === 0)
    {
        return undefined;
    }

    if (typeof (i) !== "number")
    {
        i = 0;
    }
    if (this.length - i - 1 >= 0)
    {
        return this[this.length - i - 1];
    }
    else
    {
        return this[0];
    }
};

Array.prototype.contains = function(p_item)
{
    return this.indexOf(p_item) !== -1;
};

Array.prototype.add = Array.prototype.push;

Array.prototype.addAll = function(p_items)
{
    if (Array.isArray(p_items))
    {
        var array = this;
        p_items.forEach(function(p_item)
        {
            array.push(p_item);
        });
    }
};

Array.prototype.insert = function(p_startIndex, p_item)
{
    return this.splice(p_startIndex, 0, p_item);
};

Array.prototype.insertBefore = function(p_item, p_beforeItem)
{
    var index = this.indexOf(p_beforeItem);
    if (index === -1)
    {
        return false;
    }

    this.insert(index, p_item);
    return true;
};

Array.prototype.insertAfter = function(p_item, p_afterItem)
{
    var index = this.indexOf(p_afterItem);
    if (index === -1)
    {
        return false;
    }
    else if (index === this.length)
    {
        this.add(p_item);
        return true;
    }
    else
    {
        this.insert(index + 1, p_item);
        return true;
    }
};

Array.prototype.remove = function(p_item)
{
    return this.removeAt(this.indexOf(p_item));
};

Array.prototype.removeAt = function(p_index)
{
    if (p_index >= 0 && p_index < this.length)
    {
        this.splice(p_index, 1);
        return true;
    }
    else
    {
        return false;
    }
};

Array.prototype.removeLast = function(p_index)
{
    if (this.length === 0)
    {
        return;
    }

    if (typeof (p_index) !== "number")
    {
        p_index = 0;
    }

    var i = this.length - p_index - 1;
    this.removeAt(i);
};

Array.prototype.clear = function()
{
    if (this.length > 0)
    {
        this.splice(0, this.length);
    }
};

Array.prototype.clone = function()
{
    return this.slice(0, this.length);
};

Array.prototype.swap = function(p_item1, p_item2)
{
    var index1 = this.indexOf(p_item1);
    var index2 = this.indexOf(p_item2);

    this[index1] = p_item2;
    this[index2] = p_item1;
};

Array.prototype.find = function(p_judgeFunction, p_context)
{
    if (isFunction(p_judgeFunction))
    {
        for (var i = 0; i < this.length; i++)
        {
            var item = this[i];
            var value = p_judgeFunction(item, i, p_context);
            if (value)
            {
                return item;
            }
        }
        return null;
    }
    else
    {
        return null;
    }
};

Array.prototype.findLast = function(p_judgeFunction, p_context)
{
    if (isFunction(p_judgeFunction))
    {
        for (var i = this.length - 1; i >= 0; i++)
        {
            var item = this[i];
            var value = p_judgeFunction(item, i, p_context);
            if (value)
            {
                return item;
            }
        }
        return null;
    }
    else
    {
        return null;
    }
};

Array.prototype.min = function(p_iterator, p_context)
{
    var min;
    for (var i = 0; i < this.length; i++)
    {
        var value;
        if (isFunction(p_iterator))
        {
            value = p_iterator(this[i], i, p_context);
        }
        else
        {
            value = this[i];
        }

        if (min === undefined)
        {
            min = value;
        }
        else
        {
            if (value < min)
            {
                min = value;
            }
        }
    }
    return min;
};

Array.prototype.max = function(p_iterator, p_context)
{
    var max;
    for (var i = 0; i < this.length; i++)
    {
        var value;
        if (isFunction(p_iterator))
        {
            value = p_iterator(this[i], i, p_context);
        }
        else
        {
            value = this[i];
        }

        if (max === undefined)
        {
            max = value;
        }
        else
        {
            if (value > max)
            {
                max = value;
            }
        }
    }
    return max;
};

// =====================================================================
// Object
// =====================================================================

// =====================================================================
// Function
// =====================================================================
