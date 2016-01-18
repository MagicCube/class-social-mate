import "../res/index.less";

import TabControl from "../tab/tab-control";

import CourseTab from "../tab/course-tab";
import CalendarTab from "../tab/calendar-tab";
import SessionTab from "../tab/session-tab";
import UserTab from "../tab/user-tab";

import serviceClient from "../service/service-client";

export default class Application extends mx.Application
{
    _tabControl = null;

    constructor(id)
    {
        super(id);

        this.addClass("csm-app");
        this._initTabControl();

        serviceClient.load(err => {
            if (!err)
            {
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

    run()
    {
        super.run();
        this._tabControl.selectedIndex = 1;
    }
}
