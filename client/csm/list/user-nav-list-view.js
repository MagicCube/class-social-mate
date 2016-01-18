export default class UserNavListView extends mx.View
{
    constructor(id)
    {
        super(id);

        this.addClass("user-nav-list");

        this.$container.append(`
            <ul>
                <li class=logoff><a href="/api/auth/logoff?r=${Math.random()}"><span class="title">退出登录</span></a></li>
            </ul>
        `);
    }
}
