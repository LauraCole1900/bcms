const router = require("express").Router();
const presenterRoutes = require("./presenterRoutes");

router.use("/presenters", presenterRoutes);

module.exports = router;