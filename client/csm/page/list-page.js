import TabPage from "../tab/tab-page";

import SessionListView from "../view/session-list-view";

import serviceClient from "../service/service-client";

export default class ListPage extends TabPage
{
    sessionListView = null;

    constructor()
    {
        super("sessionPage", {
            title: "列表",
            icon: "list"
        });
        this.addClass("list-page");

        this.initSessionListView();
    }

    initSessionListView()
    {
        this.sessionListView = new SessionListView("sessionList");
        this.addSubview(this.sessionListView);
    }

    activate()
    {
        super.activate();
        if (this.sessionListView.items === null)
        {
            this.sessionListView.items = serviceClient.sessions;
        }
    }
}
