const { Sequelize, DataTypes } = require("sequelize");
const CourseModel = require("../../models/course");

describe("Course Model", () => {
  const sequelize = new Sequelize("sqlite::memory:", { logging: false });
  const Course = CourseModel(sequelize, DataTypes);

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("should create a course with valid data", async () => {
    const course = await Course.create({
      courseId: "CSE102",
      courseName: "Advanced Web Development",
      credits: 4,
      departmentId: 1,
      description: "Provide advanced web development knowledge",
      preCourseId: "CSE101",
      status: "activate",
    });
    expect(course.courseId).toBe("CSE102");
    expect(course.courseName).toBe("Advanced Web Development");
    expect(course.credits).toBe(4);
    expect(course.departmentId).toBe(1);
    expect(course.description).toBe(
      "Provide advanced web development knowledge"
    );
    expect(course.preCourseId).toBe("CSE101");
    expect(course.status).toBe("activate");
  });

  it("should fail if status is not activate or deactivate", async () => {
    expect.assertions(1);
    try {
      await Course.create({
        courseId: "CSE103",
        courseName: "Very Advanced Web Development",
        credits: 4,
        departmentId: 1,
        description: "Provide very advanced web development knowledge",
        preCourseId: "CSE102",
        status: "idk",
      });
    } catch (err) {
      expect(err.name).toBe("SequelizeValidationError");
    }
  });
});
