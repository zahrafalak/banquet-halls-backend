const express = require("express");
const cors = require("cors");
const expressSession = require("express-session");
const knex = require("knex")(require("./knexfile"));
const helmet = require("helmet");
// Passport library and Google Strategy
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const menuRoute = require("./routes/menuRoute");
const hallsRoute = require("./routes/hallsRoute");
const bookingRoute = require("./routes/bookingRoute");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// =========== Passport Config ============
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"], // Define scopes here
    },
    async (_accessToken, _refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      // Implementation details as before
      knex("users")
        .select("id")
        .where({ google_id: profile.id })
        .then((user) => {
          if (user.length) {
            done(null, user[0]);
          } else {
            knex("users")
              .insert({
                google_id: profile.id, // Assuming `google_id` is a string in your schema
                avatar_url: profile._json.picture, // Make sure profile._json contains 'picture'
                username: profile.displayName, // Using the correct column name 'username'
              })
              .then((userId) => {
                done(null, { id: userId[0] });
              })
              .catch((err) => {
                console.log("Error creating a user", err);
              });
          }
        })
        .catch((err) => {
          console.log("Error fetching a user", err);
        });
    }
  )
);

// `serializeUser` determines which data of the auth user object should be stored in the session
// The data comes from `done` function of the strategy
// The result of the method is attached to the session as `req.session.passport.user = 12345`
passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);

  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: userId })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.log("Error finding user", err);
    });
});

//Routes
app.use("/api/v1/menu-packages", menuRoute);
app.use("/api/v1/halls", hallsRoute);
app.use("/api/v1/booking-requests", bookingRoute);
app.use("/auth", authRoutes);

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
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
