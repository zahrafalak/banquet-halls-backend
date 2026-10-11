# Sky Banquet Halls — Backend

A REST API for the Sky Banquet Halls booking system. Built with Node.js and Express, backed by a MySQL database, secured with Auth0, and deployed on Railway.

**Live API:** https://banquet-halls-backend-production.up.railway.app/api/v1/halls

[![CI](https://github.com/zahrafalak/banquet-halls-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/zahrafalak/banquet-halls-backend/actions/workflows/ci.yml)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MySQL
- **Query Builder:** Knex.js
- **Authentication:** Auth0 (JWT access tokens, verified with `express-oauth2-jwt-bearer`)
- **Testing:** Jest, supertest
- **CI:** GitHub Actions
- **Images:** hall photos served from the API's `public/` folder; menu photos on Cloudinary
- **Hosting:** Railway

---

## Authentication and roles

- Users log in on the front end with Auth0, which issues a JWT access token. The front end sends it as a bearer token on every protected request.
- `middleware/auth.js` (`checkAuth`) verifies the token's signature, audience and issuer against the Auth0 tenant. A missing or invalid token gets **401**.
- `middleware/requireAdmin.js` checks that the token's `https://banquet-halls-api/roles` claim includes `admin`. Anyone else gets **403**.
- Halls and menu packages are public.

| Route | Access |
|---|---|
| `GET /api/v1/halls` | Public |
| `GET /api/v1/menu-packages` | Public |
| `POST /api/v1/booking-requests` | Logged-in users |
| `GET /api/v1/my-bookings` | Logged-in users (their own bookings only) |
| `GET /api/v1/booked-dates` | Logged-in users |
| `GET /api/v1/admin/bookings` | Admins |
| `PATCH /api/v1/admin/bookings/:id` | Admins |

---

## API Endpoints

### Get all halls
```
GET /api/v1/halls
```
Returns a list of all available banquet halls.

**Response:**
```json
[
  {
    "hall_id": 13,
    "name": "Emerald Banquet Hall",
    "capacity": 300,
    "description": "Our largest hall...",
    "price": 5000,
    "hallImage_url": "https://res.cloudinary.com/..."
  }
]
```

---

### Get all menu packages
```
GET /api/v1/menu-packages
```
Returns a list of all available menu packages.

**Response:**
```json
[
  {
    "package_id": 19,
    "title": "Classic Elegance",
    "description": "A timeless selection...",
    "image_url": "https://res.cloudinary.com/...",
    "price_per_head": 75.00,
    "contents": {
      "appetizers": ["Caesar Salad", "Bruschetta"],
      "mains": ["Grilled Salmon", "Beef Wellington"],
      "desserts": ["Tiramisu", "Crème Brûlée"]
    }
  }
]
```

---

### Submit a booking request (logged in)
```
POST /api/v1/booking-requests
Authorization: Bearer <access token>
```

**Request body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "hall_id": 1,
  "menu_package_id": 2,
  "event_date": "2027-06-15"
}
```

The request is validated on the server and linked to the logged-in user (from the token, never from the request body):

- all fields are required
- names: letters (any language), spaces, apostrophes and hyphens, e.g. O'Brien, Jean-Luc, Zoë
- email in a valid format
- `event_date`: a real calendar date in `YYYY-MM-DD` format, after today in Alberta time
- `hall_id` and `menu_package_id`: positive whole numbers

**Success response:** `201 Created`

---

### My bookings (logged in)
```
GET /api/v1/my-bookings
```
Returns the logged-in user's bookings, with the hall name and menu package title.

### Booked dates (logged in)
```
GET /api/v1/booked-dates
```
Returns the dates of confirmed bookings, so the date picker can disable them.

### Admin: all bookings and status updates
```
GET   /api/v1/admin/bookings
PATCH /api/v1/admin/bookings/:id     { "status": "Confirmed" }
```
Status must be one of `Pending`, `Confirmed`, `Cancelled`, `Completed`. An unknown booking id returns **404**.

---

### Errors

| Status | When |
|---|---|
| `400` | Invalid input or a malformed JSON body (reason in `message`) |
| `401` | Missing or invalid access token |
| `403` | Logged in but not an admin |
| `404` | Booking not found (admin status update) |
| `500` | Unexpected server error. The response has a generic message; details are logged on the server only. |

---

## Local Development

### Prerequisites
- Node.js v18+
- MySQL running locally

### Setup

1. Clone the repo
```bash
git clone https://github.com/zahrafalak/banquet-halls-backend.git
cd banquet-halls-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root (never commit it):
```
PORT=8080
DB_HOST=127.0.0.1
DB_NAME=banquetHalls
DB_USER=root
DB_PASSWORD=yourpassword
DB_PORT=3306
BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
AUTH0_AUDIENCE=your-auth0-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com/
```

4. Run migrations
```bash
npm run migrate
```

5. Seed the database
```bash
npm run seed
```

6. Start the dev server
```bash
npm run dev
```

The API will be running at `http://localhost:8080`.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with nodemon |
| `npm test` | Run the Jest test suite |
| `npm run migrate` | Run database migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run seed` | Seed the database |

---

## Testing and CI

Tests live in `__tests__/` and run with Jest:

- **`requireAdmin`**: an admin token passes; a customer token, a token without roles, or no login at all gets 403.
- **Booking validation**: valid requests pass (including names like O'Brien and Zoë); missing fields, names with numbers or symbols, an email without `@`, invalid hall or menu ids, and past, impossible or badly formatted dates are rejected. "Tomorrow" is checked in Alberta time, with a fixed clock.
- **Booking controller**: a booking is linked to the logged-in user from the token, even if the body names someone else; invalid requests and statuses are rejected before touching the database; an unknown booking id returns 404.
- **Halls controller**: returns the halls with 200, and a 500 with a generic message (no internal error details) when the database fails.

- **Routes (supertest)**: every protected route returns 401 without a valid token (using the real Auth0 middleware, before any database call); a logged-in customer gets 403 on admin routes and an admin gets through; public routes work without logging in; a malformed JSON body returns 400; the `x-powered-by` header is hidden. These prove the routes in `server.js` are actually wired to the auth checks.

Unit and route tests run without a database or network: the database is replaced with a stand-in in each test.

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci` and `npm test` on every push and pull request.

---

## Deployment

This backend is deployed on **Railway** with a MySQL database service, and redeploys automatically when changes are merged to `main`.

Environment variables are set in the Railway dashboard. Hall photos are served from `public/` using `BASE_URL`; menu photos are hosted on **Cloudinary**.

To reseed the production database locally:
```bash
DB_HOST=your-public-host DB_PORT=your-public-port DB_USER=root DB_PASSWORD=yourpassword DB_NAME=railway BASE_URL=https://your-backend.up.railway.app npm run seed
```

---

## How AI was used

I built the original API during my BrainStation diploma. In 2026 I added Auth0 authentication and role-based access, and used Claude Code as a co-developer to link bookings to users, build the My Bookings and admin features, and add the tests and CI workflow. I reviewed every change, ran it against the app, and kept secrets and AI-tool configuration out of the repository.

---

## Project Structure

```
banquet-halls-backend/
├── .github/workflows/  # CI workflow (GitHub Actions)
├── __tests__/          # Jest unit tests
├── controllers/        # Route handler logic
├── middleware/         # Auth0 JWT check and admin-role check
├── migrations/         # Knex database migrations
├── public/             # Static files (images)
├── routes/             # Express route definitions
├── seeds/              # Database seed files
├── utils/              # Helper functions (validation)
├── knexfile.js         # Knex configuration
└── server.js           # Express app entry point
```

---

## Related

- **Frontend repo:** https://github.com/zahrafalak/banquet-halls-frontend
- **Live site:** https://banquet-halls-frontend.vercel.app
