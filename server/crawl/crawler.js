import cheerio from "cheerio";
import request from "request";

export default class Crawler
{
    constructor()
    {

    }

    start()
    {
        this.fetchCategories();
    }

    fetchCategories()
    {
        request.get("http://www.healthnbaby.com/", (err, res, body) => {
            if (!err && res.statusCode === 200)
            {
                const $ = cheerio.load(body);
                const categories = $(".links").toArray().map(linkEl => {
                    const $link = $(linkEl);
                    const href = $link.attr("href").trim();
                    const hrefParts = href.split("/");
                    const parentCategoryName = $link.closest(".frames").find(".heading").text().trim();
                    return {
                        id: parseInt(hrefParts[hrefParts.length - 1].trim()),
                        name: $link.text().trim(),
                        parent: parentCategoryName,
                        href: href
                    };
                });
                console.log(categories);
            }
            else
            {
                console.log(err);
            }
        });
    }
}
