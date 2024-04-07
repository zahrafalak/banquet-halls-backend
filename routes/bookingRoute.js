const router = require("express").Router();
const bookingController = require("../controllers/booking-controller");

router.route("/").post(bookingController.addNewRequest);

module.exports = router;
