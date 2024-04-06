const router = require("express").Router();
const hallsController = require("../controllers/halls-controller");

router.route("/").get(hallsController.getHalls);

module.exports = router;
