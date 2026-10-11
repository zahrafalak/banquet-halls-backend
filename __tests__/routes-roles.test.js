// Route-level tests for roles: checkAuth is replaced by a stand-in that "logs in" whoever
// the test names, so we can prove /admin routes are wired to requireAdmin.
jest.mock("../middleware/auth", () => {
  const rolesClaim = "https://banquet-halls-api/roles";
  const users = {
    customer: { sub: "auth0|customer", [rolesClaim]: [] },
    admin: { sub: "auth0|admin", [rolesClaim]: ["admin"] },
  };
  return {
    checkAuth: (req, _res, next) => {
      req.auth = { payload: users[req.headers["x-test-user"]] };
      next();
    },
  };
});

const mockQuery = jest.fn(() => Promise.resolve([]));
jest.mock("knex", () => () => mockQuery);

const request = require("supertest");
const app = require("../server");

describe("admin routes", () => {
  it("return 403 to a logged-in customer", async () => {
    const res = await request(app).get("/api/v1/admin/bookings").set("x-test-user", "customer");

    expect(res.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("let an admin through", async () => {
    const res = await request(app).get("/api/v1/admin/bookings").set("x-test-user", "admin");

    expect(res.status).toBe(200);
  });
});
