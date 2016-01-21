import app from "../../app";

export default function(req, res, next)
{
    if (req.user)
    {
        next();
    }
    else
    {
        //res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl));
        res.render("warning", { app });
    }
}
