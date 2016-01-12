export default function(req, res, next)
{
    if (req.session.user)
    {
        next();
    }
    else
    {
        console.log("Redirect to login page.");
        res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl));
    }
}
