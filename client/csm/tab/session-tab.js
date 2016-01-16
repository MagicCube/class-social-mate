import TabView from "./tab-view";

import SessionListView from "../list/session-list-view";

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
        this._sessionListView.loadOnce();
    }
}
