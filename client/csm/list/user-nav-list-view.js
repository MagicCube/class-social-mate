export default class UserNavListView extends mx.View
{
    _$mask = null;

    constructor(id)
    {
        super(id);

        this.addClass("user-nav-list");

        this.$container.append(`
            <ul>
                <li id="fav"><a><span class="icon glyphicon glyphicon-star" style="color:rgb(217,187,30);"/><span class="title">收藏应用</span></a></li>
                <li id="share"><a><span class="icon glyphicon glyphicon-share" style="color:rgb(43,119,56);"/><span class="title">分享应用</span></a></li>
                <li id="reward"><a><span class="icon glyphicon glyphicon-bookmark" style="color:rgb(189,53,53);"/><span class="title">打赏应用开发者</span></a></li>
            </ul>

            <ul>
                <li id="refresh"><a><span class="title">刷新</span></a></li>
            </ul>

            <ul>
                <li class=logoff><a href="/api/auth/logoff?r=${Math.random()}"><span class="title">退出登录</span></a></li>
            </ul>
        `);

        this.$element.on("click", "li", e => {
            const id = e.currentTarget.id;
            switch (id)
            {
                case "fav":
                    this.showWechat("fav");
                    break;
                case "share":
                    this.showWechat("share");
                    break;
                case "refresh":
                    window.location.reload(true);
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
