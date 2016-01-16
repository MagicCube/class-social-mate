import { Router } from "express";

import api from "../api";
import auth from "./auth";
import ensureLogin from "./auth/ensure-login"

const router = Router();

router.all("*", function(req, res, next) {
    req.user = req.session.user ? req.session.user : null;

    if (!req.user)
    {
        req.user = {"id":"5695032eae80543d19944ce8","name":"李昕","schoolNum":"MF1402157","selectedCourseIds":["c109","c110","c107","c111","c106","c121","c120"]};
    }

    next();
});

router.use("/auth", auth);
router.use("/api", api);

router.get("/", ensureLogin, (req, res) => {
    const courses = require("../course");
    const selectedCourses = req.user.selectedCourseIds.map(id => {
        return courses[id];
    });
    res.render("index", { user: req.user, courses: selectedCourses });
});

export default router;
