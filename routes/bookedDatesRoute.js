const router = require("express").Router();
const bookingController = require("../controllers/booking-controller");

router.route("/").get(bookingController.getBookedDates);

module.exports = router;