const db = require("../../models");
const Teacher = db.Teacher;

const createTeacher = async (req, res) => {
    try {
        const { teacherId, name } = req.body;
        if (!teacherId || !name) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!teacherId.length || !name.length) {
            return res.status(400).json({ error: "Fields cannot be empty" });
        }
            const teacher = await Teacher.create({ teacherId, name });
            res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to create teacher" });
    }
};

const updateTeacher = async (req, res) => {
    const { teacherId } = req.params;
    const { name } = req.body;
    try {
        const teacher = await Teacher.findByPk(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        await teacher.update({ name });
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to update teacher" });
    }
};

const deleteTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await Teacher.findByPk(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        await teacher.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete teacher" });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
};

const getTeacherById = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await Teacher.findByPk(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teacher" });
    }
};  

module.exports = { createTeacher, updateTeacher, deleteTeacher, getAllTeachers, getTeacherById };