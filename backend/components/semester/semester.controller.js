const db = require("../../models");
const Semester = db.Semester;

const createSemester = async (req, res) => {
    try {
        const { year, startDate, endDate, cancelDeadline } = req.body;
        if (!year || !startDate || !endDate || !cancelDeadline) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!year.length || !startDate.length || !endDate.length || !cancelDeadline.length) {
            return res.status(400).json({ error: "Fields cannot be empty" });
        }
        const semester = await Semester.create({
            year,
            startDate,
            endDate,
            cancelDeadline,
        });
        res.status(201).json(semester);
    } catch (error) {
        res.status(500).json({ error: "Failed to create semester" });
    }
};

const updateSemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { year, startDate, endDate, cancelDeadline } = req.body;
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Semester not found" });
        }
        const updateData = {
            year: year || semester.year,
            startDate: startDate || semester.startDate,
            endDate: endDate || semester.endDate,
            cancelDeadline: cancelDeadline || semester.cancelDeadline
        };
        await semester.update(updateData);
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({ error: "Failed to update semester" });
    }
};

const deleteSemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Semester not found" });
        }
        await semester.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete semester" });
    }
};

const getAllSemesters = async (req, res) => {
    try {
        const semesters = await Semester.findAll();
        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch semesters" });
    }
};

const getSemesterById = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Semester not found" });
        }
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch semester" });
    }
};

module.exports = { createSemester, updateSemester, deleteSemester, getAllSemesters, getSemesterById };