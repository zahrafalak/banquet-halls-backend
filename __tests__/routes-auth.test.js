// Route-level tests with the real Auth0 middleware: they prove the routes in server.js
// are wired to checkAuth. No database or network is needed: requests without a valid
// token are rejected before any controller or Auth0 lookup runs.
process.env.AUTH0_AUDIENCE = "https://banquet-halls-api";
process.env.AUTH0_ISSUER_BASE_URL = "https://example.auth0.com/";

const mockQuery = jest.fn(() => Promise.resolve([]));
jest.mock("knex", () => () => mockQuery);

const request = require("supertest");
const app = require("../server");

describe("protected routes reject requests without a valid login", () => {
  it.each([
    ["get", "/api/v1/my-bookings"],
    ["get", "/api/v1/booked-dates"],
    ["post", "/api/v1/booking-requests"],
    ["get", "/api/v1/admin/bookings"],
    ["patch", "/api/v1/admin/bookings/1"],
  ])("%s %s without a token returns 401", async (method, path) => {
    const res = await request(app)[method](path);

    expect(res.status).toBe(401);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("rejects a malformed token with 401", async () => {
    const res = await request(app).get("/api/v1/my-bookings").set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
  });
});

describe("public routes", () => {
  it.each(["/api/v1/halls", "/api/v1/menu-packages"])("GET %s works without logging in", async (path) => {
    const res = await request(app).get(path);

    expect(res.status).toBe(200);
  });

  it("returns 400 for a malformed JSON body", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // the server logs the parse error
    const res = await request(app)
      .post("/api/v1/halls")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid request body" });
    console.error.mockRestore();
  });

  it("doesn't advertise the server framework", async () => {
    const res = await request(app).get("/api/v1/halls");

    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
