const router = require("express").Router();
const sessionController = require("../../controllers/sessionController.js");

// stem "/api/session"
router.route("/post")
  .post(sessionController.create);


router.route("/")
  .get(sessionController.findAll);

router.route("/conference/:confid")
  .get(sessionController.findByConfId);

router.route("/:sessid")
  .get(sessionController.findBySessId);


router.route("/:sessid")
  .put(sessionController.updateSession);


router.route("/:sessid")
  .delete(sessionController.removeSession);



module.exports = router;