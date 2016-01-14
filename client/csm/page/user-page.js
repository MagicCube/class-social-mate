import TabPage from "../tab/tab-page";

export default class UserPage extends TabPage
{
    constructor()
    {
        super("userPage", {
            title: "我",
            icon: "user"
        });
        this.addClass("user-page");
    }
}
