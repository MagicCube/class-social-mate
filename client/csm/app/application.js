import "../res/index.less";

import TabControl from "../tab/tab-control";

import CourseTab from "../tab/course-tab";
import CalendarTab from "../tab/calendar-tab";
import SessionTab from "../tab/session-tab";
import UserTab from "../tab/user-tab";

import CourseDetailScene from "../scn/course-detail-scene";

import serviceClient from "../service/service-client";

export default class Application extends mx.Application
{
    _tabControl = null;
    _sceneStack = [];
    _courseDetailScene = null;

    constructor(id)
    {
        super(id);

        this.addClass("csm-app");

        this._initTabControl();

        serviceClient.load(err => {
            if (!err)
            {
                this._initRouting();
                this.run();
            }
            else
            {
                console.error(err);
            }
        });
    }

    _initTabControl()
    {
        this._tabControl = new TabControl("tabControl", [
            new CourseTab(),
            new CalendarTab(),
            new SessionTab(),
            new UserTab()
        ]);
        this.addSubview(this._tabControl);
    }

    _initRouting()
    {
        mx.route("/", context => {
            this.popScene();
        });
        mx.route("/course/:courseId", context => {
            this.pushCourseDetailScene(context.params.courseId);
        });
        mx.route("/course/:courseId/:sessionId", context => {
            this.pushCourseDetailScene(context.params.courseId, context.params.sessionId);
        });
    }

    run()
    {
        super.run();
        this._tabControl.selectedIndex = 0;
    }










    pushScene(scene, args)
    {
        scene.frame = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        scene.css({
            position: "fixed",
            zIndex: 9999,
            x: window.innerWidth
        });
        this.addSubview(scene);
        this._sceneStack.push(scene);
        this._tabControl.hideHeader();

        scene.activate(args);
        scene.transit({ x: 0 }, "fast");
    }

    popScene()
    {
        const scene = this._sceneStack.pop();
        if (scene)
        {
            scene.removeFromParent();
        }
        if (this._sceneStack.length === 0)
        {
            this._tabControl.showHeader();
        }
    }


    pushCourseDetailScene(courseId, sessionId)
    {
        if (this._courseDetailScene === null)
        {
            this._courseDetailScene = new CourseDetailScene("courseDetail");
        }
        this.pushScene(this._courseDetailScene, {
            course: serviceClient.courses[courseId],
            session: sessionId ? serviceClient.sessions[sessionId] : null
        });
    }
}
