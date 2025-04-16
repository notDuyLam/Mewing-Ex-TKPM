const { Sequelize, DataTypes } = require("sequelize");
const StudentModel = require("../../models/student");

describe("Student Model", () => {
  const sequelize = new Sequelize("sqlite::memory:", { logging: false });
  const Student = StudentModel(sequelize, DataTypes);

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("should create a student with valid data", async () => {
    const student = await Student.create({
      studentId: "SV001",
      fullName: "John",
      dateOfBirth: "2004-12-25",
      gender: "Male",
      email: "22120181@student.hcmus.edu.vn",
      phoneNumber: "0912787859",
      departmentId: 1,
      statusId: 1,
      programId: 1,
    });
    expect(student.studentId).toBe("SV001");
    expect(student.fullName).toBe("John");
    expect(student.dateOfBirth.toISOString().slice(0, 10)).toBe("2004-12-25");
    expect(student.gender).toBe("Male");
    expect(student.email).toBe("22120181@student.hcmus.edu.vn");
    expect(student.phoneNumber).toBe("0912787859");
    expect(student.departmentId).toBe(1);
    expect(student.statusId).toBe(1);
    expect(student.programId).toBe(1);
  });

  it("should fail if studentId is null", async () => {
    expect.assertions(1);
    try {
      await Student.create({ fullName: "John" });
    } catch (err) {
      expect(err.name).toBe("SequelizeValidationError");
    }
  });
});
