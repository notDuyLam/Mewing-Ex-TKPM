const { createCourse, deleteCourse} = require("../../components/course/course.controller");

jest.mock("../../models");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // .status().json()
    res.json = jest.fn();
    return res;
};

const Course = require("../../models").Course;
const Class = require("../../models").Class;

describe("createCourse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a course with no previous course successfully", async () => {
        const courseObject = {
            courseId: "CSE101",
            courseName: "Software Engineering",
            credits: 3,
            departmentId: 1,
            description: "A course about software engineering",
            preCourseId: null,
        }
        const req = {
            body: courseObject,
        };

        const res = mockResponse();

        // Mocks
        Course.findOne.mockResolvedValue(null); // Không tồn tại
        const newCourse = {status: "activate", ...courseObject};
        Course.create.mockResolvedValue(newCourse);

        // Gọi controller
        await createCourse(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Course created successfully", data: newCourse });
    })

    it("should create a course with previous course successfully", async () => {
        const courseObject = {
            courseId: "CSE101",
            courseName: "Software Engineering",
            credits: 3,
            departmentId: 1,
            description: "A course about software engineering",
            preCourseId: "CSE102",
        }
        const req = {
            body: courseObject,
        };

        const res = mockResponse();

        // Mocks
        Course.findOne.mockImplementation((query) => {
            if (query?.where?.courseId === courseObject.preCourseId) {
                return Promise.resolve({ courseId: 123 }); // Mock cho preCourseId
            }
            return Promise.resolve(null); // Mock cho các lần gọi khác (kiểm tra courseId trùng)
        });
        const newCourse = {status: "activate", ...courseObject};
        Course.create.mockResolvedValue(newCourse);

        // Gọi controller
        await createCourse(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Course created successfully", data: newCourse });
    })

    it("should return 400 if credits is less than 2", async () => {
        const courseObject = {
            courseId: "CSE101",
            courseName: "Software Engineering",
            credits: 1,
            departmentId: 1,
            description: "A course about software engineering",
            preCourseId: null,
        }
        const req = {
            body: courseObject,
        };

        const res = mockResponse();

        // Mocks
        Course.findOne.mockResolvedValue(null); // Không tồn tại

        // Gọi controller
        await createCourse(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Credits must be greater than 1" });
    })
})

describe("deleteCourse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete a course successfully", async () => {
        const req = {
            params: {
                courseId: "CSE101",
            },
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            createdAt: new Date(),
            destroy: jest.fn(),
        }
        Course.findByPk.mockResolvedValue(courseObject); 
        Class.findAll.mockResolvedValue([]); // Không tồn tại

        // Gọi controller
        await deleteCourse(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Course deleted successfully" });
    })

    it("should update course status to deactive if course was created more than 30 minutes ago", async () => {
        const req = {
            params: {
                courseId: "CSE101",
            },
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            createdAt: new Date(Date.now() - 31 * 60 * 1000),
            update: jest.fn(),
        }
        Course.findByPk.mockResolvedValue(courseObject);
        Class.findAll.mockResolvedValue([{classId: "C123"}]); // Không tồn tại

        // Gọi controller
        await deleteCourse(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Course status changed to deactive successfully" });
    })
})

it("should return 400 if preCourseId does not exist", async () => {
    const courseObject = {
        courseId: "CSE101",
        courseName: "Software Engineering",
        credits: 3,
        departmentId: 1,
        description: "A course about software engineering",
        preCourseId: "CSE000",
    };
    const req = { body: courseObject };
    const res = mockResponse();

    Course.findOne.mockImplementation((query) => {
        if (query?.where?.courseId === courseObject.preCourseId) {
            return Promise.resolve(null); // preCourseId không tồn tại
        }
        return Promise.resolve(null); // courseId cũng không tồn tại
    });

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "PreCourseId is not existed" });
});

it("should return 404 if course not found", async () => {
    const req = {
        params: {
            courseId: "NON_EXISTING",
        },
    };

    const res = mockResponse();

    Course.findByPk.mockResolvedValue(null); // Course không tồn tại

    await deleteCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
});
