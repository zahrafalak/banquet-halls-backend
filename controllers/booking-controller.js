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

    res.status(201).json({
      message: "Booking request created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error(`Error creating booking request: ${err}`);
    res.status(400).send(`Error creating booking request: ${err.message}`);
  }
};

// Get bookings for the logged-in user
const getMyBookings = async (req, res) => {
  try {
    const user_id = req.auth.payload.sub;
    const bookings = await knex("booking_requests").where({ user_id });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(`Error retrieving bookings: ${err}`);
    res.status(400).send(`Error retrieving bookings: ${err.message}`);
  }
};

// Get all bookings — admin only
const getAllBookings = async (req, res) => {
  try {
    const bookings = await knex("booking_requests");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(`Error retrieving all bookings: ${err}`);
    res.status(400).send(`Error retrieving all bookings: ${err.message}`);
  }
};

// Update booking status — admin only
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    await knex("booking_requests")
      .where({ booking_id: id })
      .update({ status });
    const updated = await knex("booking_requests")
      .where({ booking_id: id })
      .first();
    res.status(200).json(updated);
  } catch (err) {
    console.error(`Error updating booking status: ${err}`);
    res.status(400).send(`Error updating booking status: ${err.message}`);
  }
};

// Get confirmed booked dates — public
const getBookedDates = async (req, res) => {
  try {
    const bookedDates = await knex("booking_requests")
      .where({ status: "Confirmed" })
      .select("event_date");
    res.status(200).json(bookedDates.map((b) => b.event_date));
  } catch (err) {
    console.error(`Error retrieving booked dates: ${err}`);
    res.status(400).send(`Error retrieving booked dates: ${err.message}`);
  }
};

module.exports = {
  addNewRequest,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getBookedDates,
};
