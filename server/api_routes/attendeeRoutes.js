const router = require("express").Router();
const attendeeController = require("../controllers/attendeeController.js");

// stem "/api/attendee"
router.route("/post")
  .post(attendeeController.create);


router.route("/")
  .get(attendeeController.findAll);

router.route("/:id")
  .get(attendeeController.findById);

router.route("/conferences/:email")
  .get(attendeeController.findByEmail);

router.route("/conference/:id/:email")
  .get(attendeeController.findByIdAndEmail);


router.route("/update/:id/:email")
  .put(attendeeController.updateAttendee);


router.route("/delete/:id/:email")
  .delete(attendeeController.removeAttendee);

module.exports = router;