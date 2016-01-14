export default class ServiceClient extends mx.Component
{
    _courses = [];
    _sessions = [];

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

                this.courses.forEach(course => {
                    this.courses[course.id] = course;
                    course.sessions.forEach(session => {
                        session.startTime = new Date(session.startTime);
                        session.endTime = new Date(session.endTime);
                        this.sessions.add(session);
                        this.sessions[session.id] = course;
                    });
                });

                console.log(this.sessions);

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
