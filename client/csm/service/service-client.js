class ServiceClient extends mx.Component
{
    _courses = [];
    _sessions = [];
    _months = {};

    _colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

    get courses()
    {
        return this._courses;
    }

    get sessions()
    {
        return this._sessions;
    }

    get months()
    {
        return this._months;
    }

    load(cb)
    {
        $.ajax({
            url: "/api/course/current"
        }).then(res => {
            if (!res.error)
            {
                this._courses = res.result;

                this.courses.forEach((course, i) => {
                    let days = [];
                    let sessionLeft = 0;

                    course.color = this._colors[i];
                    this.courses[course.id] = course;
                    course.sessions.forEach(session => {
                        session.startTime = new Date(session.startTime);
                        session.endTime = new Date(session.endTime);
                        this.sessions.add(session);
                        this.sessions[session.id] = course;

                        const key  = $format(session.startTime, "yyyy-MM");
                        let month = this.months[key];
                        if (typeof(month) === "undefined")
                        {
                            month = [];
                            this.months[key] = month;
                        }

                        const day = session.startTime.getDay();
                        if (!days.contains(day))
                        {
                            days.push(day);
                        }
                        if (Date.now() < session.startTime )
                        {
                            sessionLeft++;
                        }

                        month.push(session);
                    });

                    days.sort((a, b) => {
                        if (a === 0)
                        {
                            a = 7;
                        }
                        if (b === 0)
                        {
                            b = 7;
                        }
                        return a - b;
                    });

                    days = days.map((day, i) => "周" + ["日", "一", "二", "三", "四", "五", "六"][day]);

                    if (days.length === 1)
                    {
                        if (course.sessions[0].startTime.getHours() > 17)
                        {
                            days[0] = days[0] + "晚";
                        }
                    }
                    course.days = days;
                    course.sessionLeft = sessionLeft;
                });

                this.sessions.sort((a, b) => {
                    return a.startTime - b.startTime;
                });

                this.courses.sort((a, b) => {
                    return a.sessions[0].startTime - b.sessions[0].startTime;
                });

                cb();
            }
            else
            {
                cb(res.error);
            }
        }, (req, status, reason) => {
            cb(reason);
        });
    }


    querySessionsByDate(date)
    {
        const results = [];
        this.sessions.forEach(session => {
            if (session.startTime.getFullYear() === date.getFullYear() && session.startTime.getMonth() === date.getMonth() && session.startTime.getDate() === date.getDate())
            {
                results.push(session);
            }
        });
        return results;
    }
}

const serviceClient = new ServiceClient();
export default serviceClient;
