class ServiceClient extends mx.Component
{
    _courses = [];
    _sessions = [];

    _colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

    get courses()
    {
        return this._courses;
    }

    get sessions()
    {
        return this._sessions;
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
                    course.color = this._colors[i];
                    this.courses[course.id] = course;
                    course.sessions.forEach(session => {
                        session.startTime = new Date(session.startTime);
                        session.endTime = new Date(session.endTime);
                        this.sessions.add(session);
                        this.sessions[session.id] = course;
                    });
                });

                this.sessions.sort((a, b) => {
                    return a.startTime - b.startTime;
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
}

const serviceClient = new ServiceClient();
export default serviceClient;
