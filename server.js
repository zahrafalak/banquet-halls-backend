require("dotenv").config();
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
app.disable("x-powered-by");
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

// Protected — logged in users only
app.use("/api/v1/my-bookings", checkAuth, myBookingsRoute);
app.use("/api/v1/booking-requests", checkAuth, bookingRoute);
app.use("/api/v1/booked-dates", checkAuth, bookedDatesRoute);

// Protected — admin only
app.use("/api/v1/admin", checkAuth, requireAdmin, adminRoute);


// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  // Malformed JSON body (from express.json)
  if (err.status === 400) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  // Handle Auth0 JWT errors
  if (err.status === 401) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (err.status === 403) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.status(500).json({
    message: "An unexpected error occurred while processing your request. Please try again later",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
