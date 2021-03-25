const router = require("express").Router();
const exhibitorController = require("../controllers/exhibitorController.js");

// stem "/api/exhibitor"
router.route("/post")
  .post(exhibitorController.create);


router.route("/")
  .get(exhibitorController.findAll);

router.route("/:id")
  .get(exhibitorController.findById);

router.route("/conference/:id")
  .get(exhibitorController.findByConfId);

router.route("/conferences/:email")
  .get(exhibitorController.findByEmail);

router.route("/conference/:id/:email")
  .get(exhibitorController.findByIdAndEmail);


router.route("/update/:id")
  .put(exhibitorController.updateExhibitor);


router.route("/delete/:id/:email")
  .delete(exhibitorController.removeExhibitor);

router.route("/deleteconf/:id")
  .delete(exhibitorController.deleteExhibitorsByConfId);

module.exports = router;