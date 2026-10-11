const { validateIncomingRequest } = require("../utils/bookingRequestHelpers");

// A booking request that passes every check; each test changes one field
const validRequest = {
  first_name: "Ayesha",
  last_name: "Khan",
  email: "ayesha@example.com",
  event_date: "2099-06-15",
  hall_id: 1,
  menu_package_id: 2,
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

  it.each(["first_name", "last_name", "email", "event_date", "hall_id", "menu_package_id"])(
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

  it.each(["O'Brien", "Jean-Luc", "Zoë"])("accepts the name %s", async (name) => {
    const result = await validateIncomingRequest({ ...validRequest, last_name: name });

    expect(result.isValid).toBe(true);
  });

  it.each([-3, 1.5, "abc"])("rejects a hall id of %p", async (hall_id) => {
    const result = await validateIncomingRequest({ ...validRequest, hall_id });

    expect(result).toEqual({ isValid: false, message: "Invalid hall or menu package" });
  });

  it("rejects an event date in the past", async () => {
    const result = await validateIncomingRequest({ ...validRequest, event_date: "2020-01-01" });

    expect(result).toEqual({ isValid: false, message: "Invalid event date" });
  });

  describe("in the evening in Alberta (already the next day in UTC)", () => {
    // 9 pm on October 10 in Edmonton is 03:00 on October 11 in UTC
    beforeEach(() => jest.useFakeTimers().setSystemTime(new Date("2026-10-11T03:00:00Z")));
    afterEach(() => jest.useRealTimers());

    it("accepts tomorrow", async () => {
      const result = await validateIncomingRequest({ ...validRequest, event_date: "2026-10-11" });

      expect(result.isValid).toBe(true);
    });

    it("rejects today", async () => {
      const result = await validateIncomingRequest({ ...validRequest, event_date: "2026-10-10" });

      expect(result).toEqual({ isValid: false, message: "Invalid event date" });
    });
  });

  it("rejects a date that doesn't exist", async () => {
    const result = await validateIncomingRequest({ ...validRequest, event_date: "2099-02-30" });

    expect(result).toEqual({ isValid: false, message: "Invalid event date" });
  });

  it("rejects an event date that is not in YYYY-MM-DD format", async () => {
    const result = await validateIncomingRequest({ ...validRequest, event_date: "15/06/2099" });

    expect(result).toEqual({ isValid: false, message: "Invalid event date" });
  });
});
