const {createClass, getClassById} = require('../../components/class/class.controller');

jest.mock('../../models');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // .status().json()
    res.json = jest.fn();
    return res;
};

const Course = require("../../models").Course;
const Class = require("../../models").Class;

describe("createClass", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a class successfully", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "activate",
        }
        Course.findByPk.mockResolvedValue(courseObject);
        Class.findOne.mockResolvedValue(null); // Không tồn tại
        Class.create.mockResolvedValue(classObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(classObject);
    })

    it("should return 400 if course status is deactivate", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "deactivate",
        }
        Course.findByPk.mockResolvedValue(courseObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Course is deactive" });
    })

    it("should return 400 if class already exists", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "activate",
        }
        Course.findByPk.mockResolvedValue(courseObject);
        Class.findOne.mockResolvedValue(classObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Class already exists" });
    })
})

describe("getClassById", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should get a class successfully", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            params: {
                classId: "C123",
            },
        };

        const res = mockResponse();

        // Mocks
        Class.findByPk.mockResolvedValue(classObject);

        // Gọi controller
        await getClassById(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(classObject);
    })

    it("should return 404 if class not found", async () => {
        const req = {
            params: {
                classId: "C123",
            },
        };

        const res = mockResponse();

        // Mocks
        Class.findByPk.mockResolvedValue(null);

        // Gọi controller
        await getClassById(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Class not found" });
    })
})