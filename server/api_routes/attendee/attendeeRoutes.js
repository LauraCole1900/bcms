const router = require("express").Router();
const attendeeController = require("../../controllers/attendeeController.js");

// stem "/api/attendees"
router.route("/post")
  .post(attendeeController.create);


router.route("/")
  .get(attendeeController.findAll);

router.route("/:id")
  .get(attendeeController.findById);


router.route("/update/:id")
  .put(attendeeController.updateAttendee);


router.route("/delete/:id")
  .delete(attendeeController.removeAttendee);

module.exports = router;