// A fake knex query builder: each test sets what .first() and .insert() resolve to
const mockBuilder = {
  where: jest.fn(() => mockBuilder),
  update: jest.fn(() => Promise.resolve(1)),
  insert: jest.fn(),
  first: jest.fn(),
};
const mockKnex = jest.fn(() => mockBuilder);
jest.mock("knex", () => () => mockKnex);

const { addNewRequest, updateBookingStatus } = require("../controllers/booking-controller");

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

  it("returns 400 for an invalid request without touching the database", async () => {
    const req = { body: { ...validBody, email: "not-an-email" }, auth: { payload: { sub: "auth0|ayesha" } } };
    const res = mockResponse();

    await addNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockBuilder.insert).not.toHaveBeenCalled();
  });
});

describe("updateBookingStatus", () => {
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
