const router = require("express").Router();
const bookingController = require("../controllers/bookingController");

router.route("/").get(bookingController.getBookedDates);

module.exports = router;