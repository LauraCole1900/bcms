const path = require("path");
const router = require("express").Router();
// const apiAttendee = require("./attendee");
const apiConference = require("./conference");
// const apiExhibitor = require("./exhibitor");
// const apiPresenter = require("./presenter");
// const apiSession = require("./session")
const apiUser = require("./user");

// API Routes
// router.use("/api", apiAttendee);
router.use("/api", apiConference);
// router.use("/api", apiExhibitor);
// router.use("/api", apiPresenter);
// router.use("/api", apiSession);
router.use("/api", apiUser);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;