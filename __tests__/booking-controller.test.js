// A fake knex query builder: where() and join() chain, and each test sets what
// .first(), .insert() and .select() resolve to
const mockBuilder = {
  where: jest.fn(() => mockBuilder),
  join: jest.fn(() => mockBuilder),
  update: jest.fn(() => Promise.resolve(1)),
  insert: jest.fn(),
  first: jest.fn(),
  select: jest.fn(),
};
const mockKnex = jest.fn(() => mockBuilder);
jest.mock("knex", () => () => mockKnex);

const {
  addNewRequest,
  getMyBookings,
  updateBookingStatus,
  getBookedDates,
} = require("../controllers/booking-controller");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const validBody = {
  first_name: "Ayesha",
  last_name: "Khan",
  email: "ayesha@example.com",
  hall_id: 1,
  menu_package_id: 2,
  event_date: "2099-06-15",
};

beforeEach(() => jest.clearAllMocks());

describe("addNewRequest", () => {
  it("links the booking to the logged-in user from the token, not the request body", async () => {
    mockBuilder.insert.mockResolvedValueOnce([42]);
    mockBuilder.first.mockResolvedValueOnce({ booking_id: 42 });
    const req = {
      body: { ...validBody, user_id: "auth0|someone-else" },
      auth: { payload: { sub: "auth0|ayesha" } },
    };
    const res = mockResponse();

    await addNewRequest(req, res);

    expect(mockBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "auth0|ayesha" }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 500 with a generic message when the database fails", async () => {
    mockBuilder.insert.mockRejectedValueOnce(new Error("ER_NO_REFERENCED_ROW: foreign key constraint fails"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const req = { body: validBody, auth: { payload: { sub: "auth0|ayesha" } } };
    const res = mockResponse();

    await addNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Could not create booking request" });
    console.error.mockRestore();
  });

  it("returns 400 for an invalid request without touching the database", async () => {
    const req = { body: { ...validBody, email: "not-an-email" }, auth: { payload: { sub: "auth0|ayesha" } } };
    const res = mockResponse();

    await addNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockBuilder.insert).not.toHaveBeenCalled();
  });
});

describe("getMyBookings", () => {
  it("returns only the logged-in user's bookings", async () => {
    const req = { auth: { payload: { sub: "auth0|ayesha" } } };
    const myBookings = [{ booking_id: 3, user_id: "auth0|ayesha", hall_name: "Ruby Lounge" }];
    mockBuilder.select.mockResolvedValueOnce(myBookings);
    const res = mockResponse();

    await getMyBookings(req, res);

    expect(mockBuilder.where).toHaveBeenCalledWith({ user_id: "auth0|ayesha" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(myBookings);
  });
});

describe("updateBookingStatus", () => {
  it("updates an existing booking and returns it with status 200", async () => {
    const updatedBooking = { booking_id: 7, status: "Confirmed" };
    mockBuilder.first.mockResolvedValueOnce(updatedBooking);
    const req = { params: { id: "7" }, body: { status: "Confirmed" } };
    const res = mockResponse();

    await updateBookingStatus(req, res);

    expect(mockBuilder.where).toHaveBeenCalledWith({ booking_id: "7" });
    expect(mockBuilder.update).toHaveBeenCalledWith({ status: "Confirmed" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedBooking);
  });

  it("returns 400 for a status that isn't allowed, without touching the database", async () => {
    const req = { params: { id: "7" }, body: { status: "Approved" } };
    const res = mockResponse();

    await updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockBuilder.update).not.toHaveBeenCalled();
  });

  it("returns 404 when the booking doesn't exist", async () => {
    mockBuilder.first.mockResolvedValueOnce(undefined); // the lookup finds nothing
    const req = { params: { id: "999" }, body: { status: "Confirmed" } };
    const res = mockResponse();

    await updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Booking not found" });
  });
});

describe("getBookedDates", () => {
  it("returns only confirmed dates, as a plain list of YYYY-MM-DD strings", async () => {
    mockBuilder.select.mockResolvedValueOnce([{ event_date: "2026-11-03" }, { event_date: "2026-12-19" }]);
    const res = mockResponse();

    await getBookedDates({}, res);

    expect(mockBuilder.where).toHaveBeenCalledWith({ status: "Confirmed" });
    // The front end's date picker depends on this exact shape
    expect(res.json).toHaveBeenCalledWith(["2026-11-03", "2026-12-19"]);
  });
});
