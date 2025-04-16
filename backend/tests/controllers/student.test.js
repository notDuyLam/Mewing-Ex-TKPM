const {
  createStudent,
} = require("../../components/student/student.controller");

const { Student } = require("../../models");
jest.mock("../../components/student/student.controller", () => ({
  ...jest.requireActual("../../components/student/student.controller"),
  validateEmailDomain: jest.fn(() => true),
  validationPhoneNumber: jest.fn(() => true),
}));
jest.mock("../../models");
jest.mock("../../log/logger");

// Helper mock
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // .status().json()
  res.json = jest.fn();
  return res;
};

describe("createStudent controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a student successfully", async () => {
    const req = {
      body: {
        studentId: "SV001",
        fullName: "John Doe",
        dateOfBirth: "2000-01-01",
        gender: "Male",
        departmentId: 1,
        course: "CSE101",
        programId: 1,
        email: "john@student.hcmus.edu.vn",
        phoneNumber: "0912345678",
        statusId: 1,
      },
      user: { id: "admin123" }, // optional
    };

    const res = mockResponse();

    // Mocks
    Student.findOne.mockResolvedValue(null); // Không tồn tại
    Student.create.mockResolvedValue({ id: 123, ...req.body });

    // Gọi controller
    await createStudent(req, res);

    // Expect controller xử lý đúng
    expect(Student.findOne).toHaveBeenCalledTimes(1);
    expect(Student.findOne).toHaveBeenCalledWith({
      where: { studentId: "SV001" },
    });
    expect(Student.create).toHaveBeenCalledTimes(1);

    expect(Student.create).toHaveBeenCalledWith(
      expect.objectContaining(req.body)
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 123, studentId: "SV001" })
    );
  });
});
