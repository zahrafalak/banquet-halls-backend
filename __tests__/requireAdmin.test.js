const { requireAdmin } = require("../middleware/requireAdmin");

const ROLES_CLAIM = "https://banquet-halls-api/roles";

// A minimal stand-in for Express's response object that records what the middleware sends
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("requireAdmin", () => {
  it("calls next() when the token carries the admin role", () => {
    const req = { auth: { payload: { [ROLES_CLAIM]: ["admin"] } } };
    const res = mockResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when the token has roles but not admin", () => {
    const req = { auth: { payload: { [ROLES_CLAIM]: ["customer"] } } };
    const res = mockResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the token has no roles claim", () => {
    const req = { auth: { payload: {} } };
    const res = mockResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when there is no auth information at all", () => {
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
