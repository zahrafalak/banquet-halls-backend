const router = require("express").Router();
const bookingController = require("../controllers/booking-controller");

router.route("/bookings").get(bookingController.getAllBookings);
router.route("/bookings/:id").patch(bookingController.updateBookingStatus);

module.exports = router;