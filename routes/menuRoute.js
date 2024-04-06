const router = require("express").Router();
const menuController = require("../controllers/menu-controller");

router.route("/").get(menuController.getMenuPackages);

module.exports = router;
