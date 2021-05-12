const router = require("express").Router();
const presenterController = require("../controllers/presenterController.js");

// stem "/api/presenter"
router.route("/post")
  .post(presenterController.create);


router.route("/")
  .get(presenterController.findAll);

router.route("/:id")
  .get(presenterController.findById);

router.route("/conference/:id")
  .get(presenterController.findByConfId);

router.route("/email/:email/:id")
  .get(presenterController.findByEmail);


router.route("/update/id/:id")
  .put(presenterController.updatePresenterById);

router.route("/update/email/:email/:id")
  .put(presenterController.updatePresenterByEmail);


router.route("/delete/id/:id")
  .delete(presenterController.removePresenterById);

router.route("/delete/email/:email/:id")
  .delete(presenterController.removePresenterByEmail);

module.exports = router;