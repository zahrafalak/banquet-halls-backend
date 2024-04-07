const knex = require("knex")(require("../knexfile"));
const { validateIncomingRequest } = require("../utils/bookingRequestHelpers");

const addNewRequest = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      hall_id,
      menu_package_id,
      event_date,
    } = req.body;

    // Validate Data
    const validation = await validateIncomingRequest(req.body);
    if (!validation.isValid) {
      // if validation.isValid returns false, handle validation error
      return res.status(400).json({ message: validation.message });
    }

    // Insert new booking request into the database
    const [newBookingId] = await knex("booking_requests").insert({
      first_name,
      last_name,
      email,
      hall_id,
      menu_package_id,
      event_date,
    });

    const newBooking = await knex("booking_requests")
      .where({ booking_id: newBookingId })
      .first();

    console.log(newBooking);
    res.status(201).json({
      message: "Booking request created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error(`Error creating booking request: ${err}`);
    res.status(400).send(`Error creating booking request: ${err.message}`);
  }
};

module.exports = {
  addNewRequest,
};
