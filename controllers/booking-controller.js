const knex = require("knex")(require("../knexfile"));

const addNewRequest = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      hall_id,
      menu_package_id,
      event_date,
      status,
    } = req.body;

    // Validate Data

    // Insert new booking request into the database
    const [newBookingId] = await knex("booking_requests").insert({
      first_name,
      last_name,
      email,
      hall_id,
      menu_package_id,
      event_date,
      status,
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
