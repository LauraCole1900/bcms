const router = require("express").Router();
const sessionRoutes = require("./sessionRoutes");

router.use("/session", sessionRoutes);

module.exports = router;