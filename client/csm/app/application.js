import "../res/index.less";

import TabControl from "../tab/tab-control";
import TabPage from "../tab/tab-page";

import CalendarPage from "../page/calendar-page";
import ListPage from "../page/list-page";
import CoursePage from "../page/course-page";
import UserPage from "../page/user-page";

import serviceClient from "../service/service-client";

export default class Application extends mx.Application
{
    serviceClient = null;
    tabControl = null;

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
        this.tabControl = new TabControl("tabControl", [
            new CoursePage(),
            new CalendarPage(),
            new ListPage(),
            new UserPage()
        ]);
        this.addSubview(this.tabControl);
    }

    run()
    {
        super.run();
        this.tabControl.selectedIndex = "listPage";
    }
}
