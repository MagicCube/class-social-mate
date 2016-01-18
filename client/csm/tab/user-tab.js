import TabView from "./tab-view";

import UserNavListView from "../list/user-nav-list-view";

import serviceClient from "../service/service-client";

export default class UserPage extends TabView
{
    _userNavListView = null;

    constructor()
    {
        super("userTab", {
            title: "我",
            icon: "user"
        });
        this.addClass("user-tab");

        this._initBanner();
        this._initUserNavListView();
    }

    _initBanner()
    {
        const $banner = $(`<div class=banner>
            <div class=avatar/>
            <div class=name>${$user.name.length === 2 ? ($user.name[0] + " " + $user.name[1]) : $user.name}</div>
            <div class=info>
                <a class=courses><span class=figure></span> 门课</a>
                <span class="separator">&nbsp;</span>
                <a class=sessions><span class=figure></span>课时</a>
            </div>
        </div>`);
        this.$container.append($banner);
        const hammer = new Hammer($banner[0], {
            recognizers: [
                [Hammer.Tap]
            ]
        });
        hammer.on("tap", e => {
            let target = null;
            if (e.target.tagName === "A")
            {
                target = e.target;
            }
            else if (e.target.tagName === "SPAN" && e.target.className === "figure")
            {
                target = e.target.parentElement;
            }

            if (target)
            {
                if (target.className === "courses")
                {
                    this.parent.select("courseTab");
                }
                else if (target.className === "sessions")
                {
                    this.parent.select("sessionTab");
                }
            }
        });
    }

    _initUserNavListView()
    {
        this._userNavListView = new UserNavListView("userNavList");
        this.addSubview(this._userNavListView);
    }

    activate()
    {
        super.activate();

        this.$container.find(".banner .courses .figure").text(serviceClient.courses.length);
        this.$container.find(".banner .sessions .figure").text(serviceClient.sessions.length);
    }
}
