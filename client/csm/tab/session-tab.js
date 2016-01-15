import TabView from "./tab-view";

import SessionListView from "../view/session-list-view";

import serviceClient from "../service/service-client";

export default class SessionTab extends TabView
{
    sessionListView = null;

    constructor()
    {
        super("sessionTab", {
            title: "列表",
            icon: "list"
        });
        this.addClass("session-tab");

        this.initSessionListView();
    }

    initSessionListView()
    {
        this.sessionListView = new SessionListView("sessionList", true);
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
