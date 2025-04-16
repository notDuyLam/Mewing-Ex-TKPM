const db = require("../../models");
const Course = db.Course;
const Class = db.Class;
const Student = db.Student;
const Enrollment = db.Enrollment;
const RegistrationHistory = db.RegistrationHistory
const Semester = db.Semester;

const registerClassForStudent = async (req, res) => {
    try {
        const { classId, studentId } = req.body;
        // Kiểm tra class ID
        const classEntity = await Class.findByPk(classId);
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Kiểm tra student ID
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Kiểm tra class ID và student ID có tồn tại hay chưa    
        if (await Enrollment.findOne({ where: { classId, studentId } })) {
            return res.status(400).json({ message: "Class already registered for student" });
        }
        // Kiểm tra số lượng student trong class
        const studentCount = await Enrollment.count({ where: { classId } });
        if (studentCount == classEntity.maxStudent) {
            return res.status(400).json({ message: "Class is full" });
        }
        // Kiểm tra môn tiên quyết
        const course = await Course.findByPk(classEntity.courseId);
        if (course.preCourseId) {
            const hasTakenPreCourse = await Enrollment.findOne({ where: {studentId} ,
                include: [
                    {
                        model: Class,
                        required: true,
                        where: { courseId: course.preCourseId }
                    }
                ]
            });
            if(!hasTakenPreCourse) 
                return res.status(400).json({ message: "Student has not passed the prerequisite course" });
            if(hasTakenPreCourse.status != "passed")
                return res.status(400).json({ message: "Student has not passed the prerequisite course" });
        }
        // Đăng ký class cho student
        const staffId = req.user?.id || 1; // mặc định staffId là 1
        const newClassStudent = await Enrollment.create({
            studentId,
            classId,
            registerBy: staffId,
        });
        // Lưu lại lịch sử
        await RegistrationHistory.create({
            studentId,
            classId,
            action: "register",
            performedBy: staffId,
        });

        return res.status(201).json(newClassStudent);
    } catch (error) {
        return res.status(500).json({
            message: "Error registering class for student",
            error: error.message,
        });
    }
};

const deregisterClassforStudent = async (req, res) => {
    try {
        const { classId, studentId } = req.body;
        // Kiểm tra class ID
        const classEntity = await Class.findByPk(classId);
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Kiểm tra student ID
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Kiểm tra class ID và student ID có tồn tại hay chưa    
        const enrollment = await Enrollment.findOne({ where: { classId, studentId } });
        if (!enrollment) {
            return res.status(400).json({ message: "Class not registered for student" });
        }
        // Kiểm tra đã qua ngày bắt đầu học kỳ hay chưa
        const semesterStartDate = await Semester.findOne({ where: { id: classEntity.semesterId } });
        if(new Date() >= new Date(semesterStartDate.startDate)){
            return res.status(400).json({ message: "Can not deregister class. Semester has started" });
        }
        // Lưu lịch sử
        const staffId = req.user?.id || 1; //
        await RegistrationHistory.create({
            studentId,
            classId,
            action: "cancel",
            performedBy: staffId,
        });
        // Xóa class cho student
        await enrollment.destroy();

        return res.status(200).json({ message: "Class deregistered successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Error deregistering class for student",
            error: error.message,
        });
    }
};

module.exports = { registerClassForStudent, deregisterClassforStudent };