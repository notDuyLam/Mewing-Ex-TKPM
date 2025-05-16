const { registerClassForStudent } = require('../../components/enrollment/enrollment.controller');
const db = require('../../models');

// Mock toàn bộ model gọi từ Sequelize
jest.mock('../../models');

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    res.send = jest.fn();
    return res;
}

describe('registerClassForStudent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it('should register a class successfully', async () => {
        // Fake data
        const fakeClass = { id: 1, maxStudent: 3, courseId: 10 };
        const fakeStudent = { id: 1001 };
        const fakeCourse = { id: 10, preCourseId: null };
        // Update fakeEnrollment with more fields
        const fakeEnrollment = { 
            id: 999, 
            studentId: 1001, 
            classId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
            // Add any other fields your model has
        };

        // Mock RegistrationHistory to return a complete object
        const fakeHistory = {
            id: 123,
            userId: 42,
            action: 'REGISTER',
            studentId: 1001,
            classId: 1,
            createdAt: new Date()
        };

        // Fake req/res
        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        // Setup mock
        db.Class.findByPk.mockResolvedValue(fakeClass);
        db.Student.findByPk.mockResolvedValue(fakeStudent);
        db.Enrollment.findOne.mockResolvedValue(null); // Not yet registered
        db.Enrollment.count.mockResolvedValue(1); // Under max
        db.Course.findByPk.mockResolvedValue(fakeCourse);
        db.RegistrationHistory.create.mockResolvedValue(fakeHistory);
        db.Enrollment.create.mockResolvedValue(fakeEnrollment);
        
        // Run
        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeEnrollment);
    });
    it('should return error for no class', async () => {

        // Fake req/res
        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        // Setup mock
        db.Class.findByPk.mockResolvedValue(null);

        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Class not found" });
    });
    it('should return error for no students', async () => {
        const fakeClass = { id: 1, maxStudent: 3, courseId: 10 };

        // Fake req/res
        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        db.Class.findByPk = jest.fn().mockResolvedValue(fakeClass);
        db.Student.findByPk = jest.fn().mockResolvedValue(null);
        

        await registerClassForStudent(req, res);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Student not found" });

    });
        it('should return error if class already registered for student', async () => {
        const fakeClass = { id: 1, maxStudent: 3, courseId: 10 };
        const fakeStudent = { id: 1001 };

        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        db.Class.findByPk.mockResolvedValue(fakeClass);
        db.Student.findByPk.mockResolvedValue(fakeStudent);
        db.Enrollment.findOne.mockResolvedValue({}); // Đã đăng ký rồi

        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Class already registered for student" });
    });

    it('should return error if class is full', async () => {
        const fakeClass = { id: 1, maxStudent: 2, courseId: 10 };
        const fakeStudent = { id: 1001 };

        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        db.Class.findByPk.mockResolvedValue(fakeClass);
        db.Student.findByPk.mockResolvedValue(fakeStudent);
        db.Enrollment.findOne.mockResolvedValue(null); // Chưa đăng ký
        db.Enrollment.count.mockResolvedValue(2); // Đã đủ chỗ

        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Class is full" });
    });

    it('should return error if student has not taken prerequisite course', async () => {
        const fakeClass = { id: 1, maxStudent: 3, courseId: 10 };
        const fakeStudent = { id: 1001 };
        const fakeCourse = { id: 10, preCourseId: 5 };

        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        db.Class.findByPk.mockResolvedValue(fakeClass);
        db.Student.findByPk.mockResolvedValue(fakeStudent);
        db.Enrollment.findOne.mockResolvedValueOnce(null); // Chưa đăng ký lớp này
        db.Enrollment.count.mockResolvedValue(1); // Chưa đủ lớp
        db.Course.findByPk.mockResolvedValue(fakeCourse);
        db.Enrollment.findOne.mockResolvedValueOnce(null); // Chưa học môn tiên quyết

        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Student has not passed the prerequisite course" });
    });

    it('should return error if student has taken prerequisite but not passed', async () => {
        const fakeClass = { id: 1, maxStudent: 3, courseId: 10 };
        const fakeStudent = { id: 1001 };
        const fakeCourse = { id: 10, preCourseId: 5 };

        const req = {
            body: { classId: 1, studentId: 1001 },
            user: { id: 42 },
        };
        const res = mockResponse();

        db.Class.findByPk.mockResolvedValue(fakeClass);
        db.Student.findByPk.mockResolvedValue(fakeStudent);
        db.Enrollment.findOne.mockResolvedValueOnce(null); // Chưa đăng ký lớp này
        db.Enrollment.count.mockResolvedValue(1);
        db.Course.findByPk.mockResolvedValue(fakeCourse);
        db.Enrollment.findOne.mockResolvedValueOnce({
            status: 'failed' // Đã học nhưng trượt
        });

        await registerClassForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Student has not passed the prerequisite course" });
    });

});
