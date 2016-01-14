import "../res/index.less";

import ServiceClient from "../service/service-client";

import TabControl from "../tab/tab-control";
import TabPage from "../tab/tab-page";

import MonthPage from "../page/month-page";
import WeekPage from "../page/week-page";
import ListPage from "../page/list-page";
import UserPage from "../page/user-page";

export default class Application extends mx.Application
{
    serviceClient = null;
    tabControl = null;

    constructor(id)
    {
        super(id);

        this.addClass("csm-app");
        this._initTabControl();

        this.serviceClient = new ServiceClient();
        this.serviceClient.load(err => {
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
            new MonthPage(),
            new WeekPage(),
            new ListPage(),
            new UserPage()
        ], "user");
        this.addSubview(this.tabControl);
    }

    run()
    {
        super.run();
        this.tabControl.selectedIndex = "month";
    }
}
