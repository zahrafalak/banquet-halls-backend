# Sky Banquet Halls — Backend

A REST API for the Sky Banquet Halls booking system. Built with Node.js and Express, backed by a MySQL database, and deployed on Railway.

**Live API:** https://banquet-halls-backend-production.up.railway.app

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MySQL
- **Query Builder:** Knex.js
- **Image Hosting:** Cloudinary
- **Hosting:** Railway

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

### Submit a booking request
```
POST /api/v1/booking-requests
```

**Request body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "hall_id": 1,
  "menu_package_id": 2,
  "event_date": "2025-06-15"
}
```

**Success response:** `201 Created`

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

3. Create a `.env` file in the root:
```
PORT=8080
DB_HOST=127.0.0.1
DB_NAME=banquetHalls
DB_USER=root
DB_PASSWORD=yourpassword
DB_PORT=3306
BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
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
| `npm run migrate` | Run database migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run seed` | Seed the database |

---

## Deployment

This backend is deployed on **Railway** with a MySQL database service.

Environment variables are set in the Railway dashboard. Images are hosted on **Cloudinary**.

To reseed the production database locally:
```bash
DB_HOST=your-public-host DB_PORT=your-public-port DB_USER=root DB_PASSWORD=yourpassword DB_NAME=railway BASE_URL=https://your-backend.up.railway.app npm run seed
```

---

## Project Structure

```
banquet-halls-backend/
├── controllers/        # Route handler logic
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
