const router = require("express").Router();
const conferenceRoutes = require("./conferenceRoutes")

router.use("/conference", conferenceRoutes);

module.exports = router;