// Function to validate incoming booking request
const validateIncomingRequest = async ({
  first_name,
  last_name,
  email,
  event_date,
}) => {
  if (!first_name || !last_name || !email || !event_date) {
    return { isValid: false, message: "Missing required fields" };
  }
  if (!/^[a-zA-Z ]+$/.test(first_name)) {
    return { isValid: false, message: "Invalid first name input" };
  }
  if (!/^[a-zA-Z ]+$/.test(last_name)) {
    return { isValid: false, message: "Invalid last name input" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, message: "Invalid email input" };
  }
  if (!isValidDate(event_date)) {
    return { isValid: false, message: "Invalid event date" };
  }
  return { isValid: true, message: "Validation successful" };
};

const isValidDate = (date) => {
  // Check if the input date is in the YYYY-MM-DD format
  const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatRegex.test(date)) {
    return false;
  }

  let today = new Date();
  // Parse the input date assuming it's in YYYY-MM-DD format
  let inputDate = new Date(date);

  // Check that the input date is in the future
  return inputDate > today;
};

module.exports = { validateIncomingRequest };
