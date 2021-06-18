const router = require("express").Router();
const committeeController = require("../controllers/committeeController.js");

// stem "/api/committee"
router.route("/post")
  .post(committeeController.create);


router.route("/:id")
  .get(committeeController.findById);

router.route("/conferences/:email")
  .get(committeeController.findByEmail);

router.route("/conference/:id")
  .get(committeeController.findByConfId);

router.route("/conference/:id/:email")
  .get(committeeController.findByIdAndEmail);


router.route("/update/:id")
  .put(committeeController.updateCommMemberById);

router.route("/update/:id/:email")
  .put(committeeController.updateCommMember);


router.route("/delete/:id/:email")
  .delete(committeeController.deleteCommMember);

router.route("/deleteconf/:id")
  .delete(committeeController.deleteCommitteeByConfId);

module.exports = router;