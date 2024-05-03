# Sky Banquet Halls

## Description

Sky Banquet Halls offers a digital booking system for banquet halls, designed to make the process of reserving a hall and selecting catering options straightforward and efficient. The platform currently allows clients to fill out a booking form and choose from a selection of menu packages and hall options.

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Database Query Builder**: Knex.js
- **API Testing**: Postman

## Features

- **Hall Booking**: Clients can complete a form to book banquet halls for specific dates and events.
- **Menu Selection**: Clients can choose from various predefined menu packages tailored to different event types and preferences.
- **Responsive Design**: The application adapts seamlessly to tablet and desktop screen sizes. The tablet screen was chosen as default considering that most people use either tablets or desktops for event planning tasks.

## Installation Instructions

This project consists of two separate parts: the frontend and the backend, each housed in their own repository. Follow the instructions below to set up both components.

### Backend Setup

1. **Clone the Backend Repository**:
   ```bash
   git clone https://github.com/zahrafalak/banquet-halls-backend.git
   cd banquet-halls-backend
   ```
2. **Install dependencies**

   ```
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a .env file in the root directory and populate it with the necessary environment variables:
   ```
    PORT=8080
    DB_HOST=127.0.0.1
    DB_NAME=banquetHalls
    DB_USER=root
    DB_PASSWORD=rootroot
   ```
4. **Run Database Migrations:**:
   ```
   npm run migrate
   ```
5. **Seed the Database:**:

   ```bash
   npm run seed
   ```

6. **Start the Backend Server:**:

   ```
   nodemon server
   ```

### Frontend Setup

1. **Clone the front end repository**:

   ```bash
   git clone https://github.com/zahrafalak/banquet-halls-frontend.git
   cd banquet-halls-frontend
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Start the development server**
   ```
   npm start
   ```

## API References

### Get List of Halls

- **HTTP Method**: GET
- **URL**: `/api/v1/halls`
- **Description**: Retrieves a list of all available banquet halls.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
  ```json
   [
     {
       "name": "Emerald Banquet Hall",
       "capacity": 300,
       "description": "Our largest hall, adorned with crystal chandeliers and a classic decor. Perfect for weddings and large corporate events.",
       "price": 5000,
       "hallImage_url": "http://localhost:8080/hall1.jpg"
     }, ...
   ]
  ```
- **Error Response**:
  - **Code**: Status 400
  - **Content**: `Error retrieving Halls: ${err}`

Notes: No authentication required for this endpoint.

### Get Menu Packages

- **HTTP Method**: GET
- **URL**: `/api/v1/menu-packages`
- **Description**: Retrieves a list of all available menu packages.
- **Success Response**:

  - **Code**: 200 OK
  - **Content**:

  ```json
  [
    {
        "title": "Classic Elegance",
        "description": "A timeless selection of our most beloved dishes, perfect for any occasion.",
        "image_url": "http://localhost:8080/classic.jpg",
        "price_per_head": 75.0,
        "contents": {
        "appetizers": ["Caesar Salad", "Bruschetta"],
        "mains": ["Grilled Salmon with Lemon Butter", "Beef Wellington"],
        "desserts": ["Tiramisu", "Crème Brûlée"]
    }
     }, ...
  ]
  ```

- **Error Response**:
  - **Code**: Status 400
  - **Content**: `Error retrieving Menu Packages: ${err.message}`

Notes: No authentication required for this endpoint.

### Make a booking request

- **HTTP Method**: POST
- **URL**: `/api/v1/booking-requests`
- **Description**: Submit a booking request for a specific date with menu package and hall preferences.
- **Example Request Body**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "name@example.com",
  "hall_id": 1,
  "menu_package_id": 3,
  "event_date": "2024-12-12"
}
```

- **Success Response**:

  - **Code**: 201 CREATED
  - **Content**: "Booking request created successfully"

- **Error Response**:
  - **Code**: Status 400
  - **Content**: `Error creating booking request: ${err.message}`

## Frontend Validation

### Overview

This application employs comprehensive front-end validation to enhance the user experience and ensure data integrity before form submission. Validation occurs both on submission and as users exit (onBlur) each input field.

### Validation Details

- **Field Completion**: Ensures that all required fields are filled out prior to form submission. Immediate feedback is provided if a field is left empty.

- **Regular Expressions (Regex)**:

  - **Name**: Validates that the name field contains only letters and spaces.
  - **Email**: Confirms that the email address conforms to a standard email format.
  - **Event Date**: Ensures that the event date follows the `YYYY-MM-DD` format.
    - Additional Check: Validates that the entered date is in the future, enhancing reliability and relevance of the booking.

- **Selection Requirements**: Validates that a hall and a menu package have been selected from the dropdown options provided.

- **OnBlur Validation**: Provides real-time feedback by validating each input field as the user moves away from it, allowing for immediate correction of any detected errors.

### Error Handling

Real-time feedback is provided via error messages displayed adjacent to the relevant input fields if validation fails. This allows users to correct any issues promptly.

## Backend Validation

### Overview

The server-side validation ensures robust data integrity and error handling by verifying that all required fields are present and correctly formatted before processing any requests.

### Validation Details

- **Field Presence**: Checks that all required fields are included in the request body to prevent processing incomplete submissions.

- **Data Format Validation**:
  - **Name**: Verifies that the name only contains letters and spaces.
  - **Email**: Ensures the email adheres to a valid format.
  - **Event Date**: Confirms that the date is in the `YYYY-MM-DD` format and is a future date, not past.
