import { Router } from "express";

import auth from "./auth";
import course from "./course";
import user from "./user";
import ical from "./ical";

const router = Router();

router.use("/auth", auth);
router.use("/course", course);
router.use("/user", user);
router.use("/ical", ical);

export default router;
