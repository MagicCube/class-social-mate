import TabPage from "../tab/tab-page";

export default class WeekPage extends TabPage
{
    constructor()
    {
        super("week", {
            title: "周",
            icon: "equalizer"
        });
        this.addClass("week-page");
    }
}
