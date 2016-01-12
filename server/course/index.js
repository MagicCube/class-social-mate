import rawCourses from '../../data/raw-courses';

const courses = rawCourses.map((rawCourse) => {
    const course = {
        id: rawCourse.id,
        name: rawCourse.name,
        teachers: rawCourse.teachers,
        room: rawCourse.room,
        searchKey: rawCourse.searchKey ? rawCourse.searchKey : rawCourse.name
    };

    const sessions = [];
    for (let i = 0; i < rawCourse.sessions.length; i++)
    {
        const rawSession = rawCourse.sessions[i];
        let session = null;
        if (rawSession.indexOf(":") !== -1)
        {
            const timeString = `${YEAR}-` + rawSession;
            session = {
                startTime: new Date(timeString)
            };
            sessions.push(session);
        }
        else
        {
            const dateString = `${YEAR}-` + rawSession;
            session = {
                startTime: new Date(dateString + " 09:00")
            };
            sessions.push(session);
            session = {
                startTime: new Date(dateString + " 13:30")
            };
            sessions.push(session);
        }
    }

    course.sessions = sessions;
    return course;
});

for (let i = 0; i < courses.length; i++)
{
    const c = courses[i];
    c.sessions.forEach((session, i) => {
        session.courseId = c.id;
        session.id = c.id + "-" + (i + 1);
        session.endTime = new Date(session.startTime * 1 + 3 * 60 * 60 * 1000);
    })
    courses[c.id] = c;
}

export default courses;
