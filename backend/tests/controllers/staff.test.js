const { getStaffById } = require("../../components/staff/staff.controller");
const Staff = require("../../models").Staff;

jest.mock("../../models");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

describe("getStaffById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and staff data if staff exists", async () => {
    const staffObject = {
      staffId: "S123",
      name: "John Doe",
      departmentId: "D1",
    };
    const req = { params: { staffId: "S123" } };
    const res = mockResponse();

    Staff.findByPk.mockResolvedValue(staffObject);

    await getStaffById(req, res);

    expect(Staff.findByPk).toHaveBeenCalledWith("S123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(staffObject);
  });

  it("should return 404 if staff not found", async () => {
    const req = { params: { staffId: "S123" } };
    const res = mockResponse();

    Staff.findByPk.mockResolvedValue(null);

    await getStaffById(req, res);

    expect(Staff.findByPk).toHaveBeenCalledWith("S123");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Staff not found" });
  });

  it("should return 500 if an error occurs", async () => {
    const req = { params: { staffId: "S123" } };
    const res = mockResponse();

    Staff.findByPk.mockRejectedValue(new Error("DB error"));

    await getStaffById(req, res);

    expect(Staff.findByPk).toHaveBeenCalledWith("S123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch staff" });
  });
});
