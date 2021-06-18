const path = require("path");
const router = require("express").Router();
const apiAttendee = require("./attendeeRoutes");
const apiCommittee = require("./committeeRoutes");
const apiConference = require("./conferenceRoutes");
const apiExhibitor = require("./exhibitorRoutes");
const apiPresenter = require("./presenterRoutes");
const apiSchedule = require("./scheduleRoutes");
const apiSession = require("./sessionRoutes")
const apiUser = require("./userRoutes");

// API Routes
router.use("/api/attendee", apiAttendee);
router.use("/api/committee", apiCommittee);
router.use("/api/conference", apiConference);
router.use("/api/exhibitor", apiExhibitor);
router.use("/api/presenter", apiPresenter);
router.use("/api/schedule", apiSchedule);
router.use("/api/session", apiSession);
router.use("/api/user", apiUser);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;