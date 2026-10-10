const { validateIncomingRequest } = require("../utils/bookingRequestHelpers");

// A booking request that passes every check; each test changes one field
const validRequest = {
  first_name: "Ayesha",
  last_name: "Khan",
  email: "ayesha@example.com",
  event_date: "2099-06-15",
};

describe("validateIncomingRequest", () => {
  it("accepts a complete, valid request", async () => {
    const result = await validateIncomingRequest(validRequest);

    expect(result).toEqual({ isValid: true, message: "Validation successful" });
  });

  it("rejects an email without an @", async () => {
    const result = await validateIncomingRequest({ ...validRequest, email: "ayesha.example.com" });

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Invalid email input");
  });

  it.each(["first_name", "last_name", "email", "event_date"])(
    "rejects a request missing %s",
    async (field) => {
      const result = await validateIncomingRequest({ ...validRequest, [field]: "" });

      expect(result).toEqual({ isValid: false, message: "Missing required fields" });
    }
  );

  it("rejects a first name containing numbers or symbols", async () => {
    const result = await validateIncomingRequest({ ...validRequest, first_name: "Ay3sha!" });

    expect(result).toEqual({ isValid: false, message: "Invalid first name input" });
  });

  it("rejects a last name containing numbers or symbols", async () => {
    const result = await validateIncomingRequest({ ...validRequest, last_name: "Kh@n" });

    expect(result).toEqual({ isValid: false, message: "Invalid last name input" });
  });

  it("rejects an event date in the past", async () => {
    const result = await validateIncomingRequest({ ...validRequest, event_date: "2020-01-01" });

    expect(result).toEqual({ isValid: false, message: "Invalid event date" });
  });

  it("rejects an event date that is not in YYYY-MM-DD format", async () => {
    const result = await validateIncomingRequest({ ...validRequest, event_date: "15/06/2099" });

    expect(result).toEqual({ isValid: false, message: "Invalid event date" });
  });
});
