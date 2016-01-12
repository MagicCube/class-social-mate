import "../global";
import should from "should";

import courses from "../server/course";

describe("courses", function() {
    describe("#load", function() {
        it("should load all the courses correctly", function() {
            const c100 = courses["c100"];
            const c109 = courses["c109"];
            const c112 = courses["c112"];
            const c122 = courses["c122"];

            should(courses).have.length(24);

            courses.forEach(course => {
                course.sessions.forEach(session => {
                    const weekDay = session.startTime.getDay();
                    if (session.courseId === "c112")
                    {
                        weekDay.should.be.exactly(5);
                    }
                    else if (session.courseId === "c109")
                    {
                        weekDay.should.be.exactly(4);
                    }
                    else
                    {
                        should(weekDay === 6 || weekDay === 0).be.true();
                    }
                });
            });

            should(c100.sessions).have.lengthOf(6);
            should(c109.sessions).have.length(6);
            should(c112.sessions).have.length(6);
            should(c122.sessions).have.length(4);

            should(c100.sessions[0]).containEql({
                id: "c100-1",
                courseId: "c100",
                startTime: new Date("2016-4-9 9:00"),
                endTime: new Date("2016-4-9 12:00")
            });
            should(c100.sessions[1]).containEql({
                id: "c100-2",
                courseId: "c100",
                startTime: new Date("2016-4-9 13:30"),
                endTime: new Date("2016-4-9 16:30")
            });

            should(c109.sessions[0]).containEql({
                id: "c109-1",
                courseId: "c109",
                startTime: new Date("2016-3-3 18:30"),
                endTime: new Date("2016-3-3 21:30")
            });
        });
    });
});
