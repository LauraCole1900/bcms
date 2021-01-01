const router = require("express").Router();
const userController = require("../controllers/userController.js");

// stem "/api/user"
router.route("/post")
  .post(userController.create);


router.route("/")
  .get(userController.findAll);

router.route("/:email")
  .get(userController.findByEmail);


router.route("/update/:id")
  .put(userController.updateUser);


router.route("/delete/:id")
  .delete(userController.removeUser);

module.exports = router;