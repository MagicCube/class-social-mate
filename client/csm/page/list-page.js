import TabPage from "../tab/tab-page";

export default class ListPage extends TabPage
{
    constructor()
    {
        super("list", {
            title: "列表",
            icon: "list"
        });
        this.addClass("list-page");
    }
}
