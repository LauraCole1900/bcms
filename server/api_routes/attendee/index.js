const router = require("express").Router();
const attendeeRoutes = require("./attendeeRoutes");

router.use("/attendees", attendeeRoutes);

module.exports = router;