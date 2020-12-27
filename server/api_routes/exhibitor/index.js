const router = require("express").Router();
const exhibitorRoutes = require("./exhibitorRoutes");

router.use("/exhibitors", exhibitorRoutes);

module.exports = router;