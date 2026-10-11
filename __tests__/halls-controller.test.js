// Replace knex so the controller can be tested without a database: each test decides what the query returns
const mockQuery = jest.fn();
jest.mock("knex", () => () => mockQuery);

const { getHalls } = require("../controllers/halls-controller");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getHalls", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns the halls with status 200", async () => {
    const halls = [{ hall_id: 1, name: "Emerald Banquet Hall" }];
    mockQuery.mockResolvedValueOnce(halls);
    const res = mockResponse();

    await getHalls({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(halls);
  });

  it("returns 500 with a generic message when the database fails, without exposing the error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("connect ECONNREFUSED 10.0.0.5:3306"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = mockResponse();

    await getHalls({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Could not retrieve halls" });
    expect(JSON.stringify(res.json.mock.calls)).not.toContain("ECONNREFUSED");
  });
});
