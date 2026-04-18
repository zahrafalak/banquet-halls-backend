const express = require("express");
const cors = require("cors");
const menuRoute = require("./routes/menuRoute");
const hallsRoute = require("./routes/hallsRoute");
const bookingRoute = require("./routes/bookingRoute");
const { checkAuth } = require("./middleware/auth");
const { requireAdmin } = require("./middleware/requireAdmin");
const myBookingsRoute = require("./routes/myBookingsRoute");
const adminRoute = require("./routes/adminRoute");
const bookedDatesRoute = require("./routes/bookedDatesRoute");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json());
app.use(express.static("public"));

//Routes

// Public
app.use("/api/v1/menu-packages", menuRoute);
app.use("/api/v1/halls", hallsRoute);
app.use("/api/v1/booked-dates", bookedDatesRoute);

// Protected — logged in users only
app.use("/api/v1/my-bookings", checkAuth, myBookingsRoute);
app.use("/api/v1/booking-requests", checkAuth, bookingRoute);

// Protected — admin only
app.use("/api/v1/admin", checkAuth, requireAdmin, adminRoute);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "An unexpected error occurred while processing your request. Please try again later"
    );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
