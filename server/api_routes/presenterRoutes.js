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

router.route("/email/:email")
  .get(presenterController.findByEmail);


router.route("/update/:id")
  .put(presenterController.updatePresenter);


router.route("/delete/:id")
  .delete(presenterController.removePresenter);

module.exports = router;