import "../res/index.less";

import TabControl from "../nav/tab-control";
import TabPage from "../nav/tab-page";

export default class Application extends mx.Application
{
    constructor(id)
    {
        super(id);

        this.addClass("csm-app");
        this._initTabControl();
    }

    _initTabControl()
    {
        this.tabControl = new TabControl("tabControl", [
            new TabPage("month", { title: "月份", icon: "calendar" }),
            new TabPage("week", { title: "星期", icon: "equalizer" }),
            new TabPage("list", { title: "列表", icon: "th-list" }),
            new TabPage("user", { title: "我", icon: "user" })
        ]);
        this.addSubview(this.tabControl);
    }

    run()
    {
        super.run();

        console.log("The app is now running.");
    }
}
