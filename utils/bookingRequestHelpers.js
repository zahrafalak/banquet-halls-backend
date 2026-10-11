// Function to validate incoming booking request
// Letters from any language, plus spaces, apostrophes and hyphens (e.g. O'Brien, Jean-Luc, Zoë)
const NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u;

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const validateIncomingRequest = async ({
  first_name,
  last_name,
  email,
  event_date,
  hall_id,
  menu_package_id,
}) => {
  if (!first_name || !last_name || !email || !event_date || !hall_id || !menu_package_id) {
    return { isValid: false, message: "Missing required fields" };
  }
  if (!NAME_PATTERN.test(first_name)) {
    return { isValid: false, message: "Invalid first name input" };
  }
  if (!NAME_PATTERN.test(last_name)) {
    return { isValid: false, message: "Invalid last name input" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, message: "Invalid email input" };
  }
  if (!isValidDate(event_date)) {
    return { isValid: false, message: "Invalid event date" };
  }
  if (!isPositiveInteger(hall_id) || !isPositiveInteger(menu_package_id)) {
    return { isValid: false, message: "Invalid hall or menu package" };
  }
  return { isValid: true, message: "Validation successful" };
};

const isValidDate = (date) => {
  // Check if the input date is in the YYYY-MM-DD format
  const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatRegex.test(date)) {
    return false;
  }

  // The input must be a real calendar date (rejects e.g. 2027-02-30)
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    return false;
  }

  // Compare calendar days in the venue's time zone, not the server's (UTC),
  // so "tomorrow" is still bookable in the evening in Alberta
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Edmonton" });
  return date > today;
};

module.exports = { validateIncomingRequest };
