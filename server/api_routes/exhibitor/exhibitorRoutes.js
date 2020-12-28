const router = require("express").Router();
const exhibitorController = require("../../controllers/exhibitorController.js");

// stem "/api/exhibitors"
router.route("/post")
  .post(exhibitorController.create);


router.route("/")
  .get(exhibitorController.findAll);

router.route("/:id")
  .get(exhibitorController.findById);


router.route("/update/:id")
  .put(exhibitorController.updateExhibitor);


router.route("/delete/:id")
  .delete(exhibitorController.removeExhibitor);

module.exports = router;