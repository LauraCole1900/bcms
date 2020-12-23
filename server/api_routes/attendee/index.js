const router = require("express").Router();
const attendeeRoutes = require("./attendeeRoutes");

router.use("/attendee", attendeeRoutes);

module.exports = router;