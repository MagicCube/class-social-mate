import TabView from "./tab-view";

import SessionListView from "../view/session-list-view";

import serviceClient from "../service/service-client";

export default class SessionTab extends TabView
{
    _sessionListView = null;

    constructor()
    {
        super("sessionTab", {
            title: "列表",
            icon: "list"
        });
        this.addClass("session-tab");

        this._initSessionListView();
    }

    _initSessionListView()
    {
        this._sessionListView = new SessionListView("sessionList", true);
        this.addSubview(this._sessionListView);
    }

    activate()
    {
        super.activate();
        if (this._sessionListView.items === null)
        {
            this._sessionListView.items = serviceClient.sessions;
        }
    }
}
