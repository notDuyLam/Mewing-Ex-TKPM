const db = require("../../models");
const Course = db.Course;
const Class = db.Class;

const createClass = async (req, res) => {
    try {
        const { classId, courseId, year, semesterId, teacherId, maxStudent, schedule, room } = req.body;

        if (!classId || !courseId || !year || !semesterId || !teacherId || !maxStudent || !schedule || !room) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        if (!classId.length || !courseId.length || !year.length || !semesterId.length || !teacherId.length || !maxStudent.length || !schedule.length || !room.length) {
            return res.status(400).json({ message: 'Fields cannot be empty' });
        }
        // Kiểm tra tính hợp lệ của schedule
        const isValidDate = (value) => {
            return value instanceof Date && !isNaN(value);
        };
        if (isValidDate(schedule)) {
            return res.status(400).json({ message: 'Schedule must be a valid date' });
        }
        
        // Kiểm tra course ID
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
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
        const classes = await Class.findAll();
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
        const classEntity = await Class.findByPk(classId);
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

const updateClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { year, semesterId, teacherId, maxStudent, schedule, room } = req.body;
        const classEntity = await Class.findByPk(classId);
        if (!classEntity) {
            return res.status(404).json({ message: "Class not found" });
        }
        const updateData = {
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
    updateClass 
};