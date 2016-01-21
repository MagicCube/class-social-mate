export default class UserNavListView extends mx.View
{
    _$mask = null;

    constructor(id)
    {
        super(id);

        this.addClass("user-nav-list");

        this.$container.append(`
            <ul>
                <li id="refresh"><a><span class="icon glyphicon glyphicon-refresh" style="color:rgb(70,128,238);"/><span class="title">更新</span></a></li>
                <li id="download" data-toggle="modal" data-target="#downloadDialog"><a onclick="_hmt.push(['_trackEvent', 'download', 'click', $user.name]);"><span class="icon glyphicon glyphicon-calendar" style="color:rgb(238,146,70);"/><span class="title">下载到我的日历</span></a></li>
            </ul>
            <ul>
                <li id="fav"><a><span class="icon glyphicon glyphicon-star" style="color:rgb(224,228,25);"/><span class="title">收藏本应用</span></a></li>
                <li id="share"><a><span class="icon glyphicon glyphicon-share" style="color:rgb(43,119,56);"/><span class="title">分享本应用</span></a></li>
                <li data-toggle="modal" data-target="#rewardDialog"><a onclick="_hmt.push(['_trackEvent', 'reward', 'click', $user.name]);"><span class="icon glyphicon glyphicon-bookmark" style="color:rgb(189,53,53);"/><span class="title">打赏开发者</span></a></li>
            </ul>

            <ul>
                <li class=logoff><a onclick="_hmt.push(['_trackEvent', 'logoff', 'click', $user.name]);" href="/api/auth/logoff?r=${Math.random()}"><span class="title">退出登录</span></a></li>
            </ul>
        `);

        this.$container.find("li#download").toggle(navigator.userAgent.indexOf("iPhone") !== -1 || navigator.userAgent.indexOf("iPad") !== -1);

        this.$element.on("click", "li", e => {
            const id = e.currentTarget.id;
            switch (id)
            {
                case "refresh":
                    window.location.reload(true);
                    break;
                case "fav":
                    this.showWechat("fav");
                    _hmt.push(['_trackEvent', 'fav', 'click', $user.name]);
                    break;
                case "share":
                    this.showWechat("share");
                    _hmt.push(['_trackEvent', 'share', 'click', $user.name]);
                    break;
            }
        });
    }

    showWechat(type)
    {
        if (this._$mask === null)
        {
            this._$mask = $("<div class=wechat-mask><span/></div>");
            this._$mask.on("click", () => {
                this._$mask.transit({
                    opacity: 0
                }, "fast", () => {
                    this._$mask.detach();
                });
            });
        }
        this._$mask.removeClass("share fav").addClass(type);
        this._$mask.css({ opacity: 0 });
        $(document.body).append(this._$mask);
        this._$mask.transit({ opacity: 1 });
    }
}
