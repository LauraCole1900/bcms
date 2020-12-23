const router = require("express").Router();
const userController = require("../../controllers/userController.js");

// stem "/api/users"
router.route("/post")
  .post(userController.create);


router.route("/")
  .get(userController.findAll);

router.route("/:id")
  .get(userController.findById);


router.route("/:id")
  .put(userController.updateUser);


router.route("/:id")
  .delete(userController.removeUser);

module.exports = router;