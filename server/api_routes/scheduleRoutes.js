const router = require("express").Router();
const scheduleController = require("../controllers/scheduleController.js");

// stem "/api/schedule"
router.route("/post")
  .post(scheduleController.create);


router.route("/conference/:id")
.get(scheduleController.findByConfId);


router.route("/update/conference/:id")
.put(scheduleController.updateScheduleByConfId);


module.exports = router;