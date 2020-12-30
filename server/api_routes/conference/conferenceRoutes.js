const router = require("express").Router();
const conferenceController = require("../../controllers/conferenceController.js")

// stem "/api/conference"
router.route("/post")
  .post(conferenceController.create);


router.route("/")
  .get(conferenceController.findAll);

router.route("/email/:email")
  .get(conferenceController.findByEmail);

router.route("/attending/:email")
  .get(conferenceController.findConfAttending);

router.route("/presenting/:email")
  .get(conferenceController.findConfPresenting);

router.route("/exhibiting/:email")
  .get(conferenceController.findConfExhibiting);

router.route("/:id")
  .get(conferenceController.findById);


router.route("/update/:id")
  .put(conferenceController.updateConference);

router.route("/:email/:id")
  .put(conferenceController.updateRegistered);


router.route("/delete/:id")
  .delete(conferenceController.removeConference);

  

module.exports = router;