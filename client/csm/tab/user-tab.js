import TabView from "./tab-view";

import serviceClient from "../service/service-client";

export default class UserPage extends TabView
{
    constructor()
    {
        super("userTab", {
            title: "我",
            icon: "user"
        });
        this.addClass("user-tab");

        const $banner = $(`<div class=banner>
            <div class=avatar/>
            <div class=name>${$user.name.length === 2 ? ($user.name[0] + " " + $user.name[1]) : $user.name}</div>
            <div class=info>
                <a class=courses><span class=figure></span> 门课</a>
                <span class="separator">&nbsp;</span>
                <a class=sessions><span class=figure></span>课时</a>
            </div>
        </div>`);
        $banner.on("tap", "a", e => {
            if (e.currentTarget.className === "courses")
            {
                this.parent.select("coursePage");
            }
            else if (e.currentTarget.className === "sessions")
            {
                this.parent.select("listPage");
            }
        });
        this.$container.append($banner);
    }

    activate()
    {
        super.activate();

        this.$container.find(".banner .courses .figure").text(serviceClient.courses.length);
        this.$container.find(".banner .sessions .figure").text(serviceClient.sessions.length);
    }
}
