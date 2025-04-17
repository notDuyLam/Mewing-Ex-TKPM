const db = require("../../models");
const Course = db.Course;
const Class = db.Class;
const Enrollment = db.Enrollment;
const Student = db.Student;
const Semester = db.Semester;
const Teacher = db.Teacher;

const createClass = async (req, res) => {
    try {
        const { classId, courseId, year, semesterId, teacherId, maxStudent, schedule, room } = req.body;

        if (!classId || !courseId || !year || !semesterId || !teacherId || !maxStudent || !schedule || !room) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Kiểm tra tính hợp lệ của schedule
        const isValidDate = (value) => {
            return value instanceof Date && !isNaN(value);
        };
        if (isValidDate(schedule)) {
            return res.status(400).json({ message: 'Schedule must be a valid time' });
        }
        
        // Kiểm tra course ID
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course) {
            if (course.status === 'deactivate') {
                return res.status(400).json({ message: "Course is deactive" });
            }
        }
        // Kiểm tra class ID có tồn tại hay chưa
        if (await Class.findOne({ where: { classId } })) {
            return res.status(400).json({ message: "Class already exists" });
        }
        const newClass = await Class.create({
            classId,
            courseId,
            year,
            semesterId,
            teacherId,
            maxStudent,
            schedule,
            room
        });
        return res.status(201).json(newClass);
    } catch (error) {
        return res.status(500).json({
            message: "Error creating class",
            error: error.message,
        });
    }
};

const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [{
                model: Course,
                as: 'Course'
            },
            {model: Semester, as:'Semester'},
            {model: Teacher, as: 'Teacher'}]
        });
        return res.status(200).json(classes);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving classes",
            error: error.message,
        });
    }
};

const getClassById = async (req, res) => {
    try {
        const { classId } = req.params;
        const classEntity = await Class.findByPk(classId, {
            include: [
                {
                    model: Course,
                    as: 'Course',
                },
                {
                    model: Semester,
                    as: 'Semester',
                },
                {
                    model: Teacher,
                    as: 'Teacher',
                }
            ]
        });
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        return res.status(200).json(classEntity);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving class",
            error: error.message,
        });
    }
};

const getStudents = async (req, res) => {
    try {
        const { classId } = req.params;
        const classEntity = await Class.findByPk(classId);
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        const enrollments = await Enrollment.findAll({ where: { classId }, 
            include: [
                { model: Student, as: "Student" },
            ]
        });
        return res.status(200).json(enrollments);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving student count",
            error: error.message,
        });
    }
};

const updateClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { courseId, year, semesterId, teacherId, maxStudent, schedule, room } = req.body;
        const classEntity = await Class.findByPk(classId);
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Kiểm tra tính hợp lệ của schedule
        const isValidDate = (value) => {
            return value instanceof Date && !isNaN(value);
        };
        if (schedule && isValidDate(schedule)) {
            return res.status(400).json({ message: 'Schedule must be a valid time' });
        }
        
        // Kiểm tra course ID
        if (courseId) {
            const course = await Course.findByPk(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
        }
        const updateData = {
            courseId: courseId || classEntity.courseId,
            year: year || classEntity.year,
            semesterId: semesterId || classEntity.semesterId,
            teacherId: teacherId || classEntity.teacherId,
            maxStudent: maxStudent || classEntity.maxStudent,
            schedule: schedule || classEntity.schedule,
            room: room || classEntity.room
        }
        await classEntity.update(updateData);
        return res.status(200).json(classEntity);
    } catch (error) {
        return res.status(500).json({
            message: "Error updating class",
            error: error.message,
        });
    }
};

module.exports = { 
    createClass, 
    getAllClasses, 
    getClassById, 
    getStudents,
    updateClass 
};