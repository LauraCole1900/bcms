const router = require("express").Router();
const sessionController = require("../controllers/sessionController.js");

// stem "/api/session"
router.route("/post")
  .post(sessionController.create);


router.route("/")
  .get(sessionController.findAll);

router.route("/conference/:confId")
  .get(sessionController.findByConfId);

router.route("/:id")
  .get(sessionController.findBySessId);


router.route("/update/:id")
  .put(sessionController.updateSession);


router.route("/delete/:id")
  .delete(sessionController.removeSession);

router.route("/deleteconf/:id")
  .delete(sessionController.deleteSessionsByConfId);

module.exports = router;