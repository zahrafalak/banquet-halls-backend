const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

//Routes
app.use("/api/v1/menu-packages", menu);
app.use("/api/v1/halls", halls);
app.use("/api/v1/booking-requests", booking);

// Error handling middleware
app.use((err, req, res, next) => {
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
