const router = require("express").Router();
const exhibitorRoutes = require("./exhibitorRoutes");

router.use("/exhibitor", exhibitorRoutes);

module.exports = router;