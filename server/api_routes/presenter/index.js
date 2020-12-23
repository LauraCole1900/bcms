const router = require("express").Router();
const presenterRoutes = require("./presenterRoutes");

router.use("/presenter", presenterRoutes);

module.exports = router;