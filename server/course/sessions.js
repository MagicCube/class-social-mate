import courses from "./courses";

const sessions = [];
courses.forEach(course => {
    course.sessions.forEach(session => {
        sessions[session.id] = session;
        sessions.push(session);
    });
});

export default sessions;
