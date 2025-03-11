const { Student, sequelize } = require('../models/student');
const { Op } = require("sequelize");

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            order: [['id', 'ASC']]
        });
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await Student.findByPk(studentId); 
        if(!student) {
            return res.status(404).json({ message: "Cannot find student"});
        }
        res.json(student);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ message: "Server error"});
    }
};

// Create new student
exports.createStudent = async (req, res) => {
    try {
        const { id, name, dob, gender, faculty, schoolYear, status, program, address, email, phone } = req.body;
        const newStudent = await Student.create({id, name, dob, gender, faculty, schoolYear, status, program, address, email, phone});
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, dob, gender, faculty, schoolYear, status, program, address, email, phone } = req.body;

        const student = await Student.findByPk(id);
        if(!student){
            return res.status(404).json({error: "Student not found" });
        }

        await student.update({ name, dob, gender, faculty, schoolYear, status, program, address, email, phone });
        res.status(200).json(student);
    } catch(error) {
        res.status(500).json({error: error.message });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        await student.destroy();
        res.status(204).send();
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
};

// Search students
exports.searchStudents = async (req, res) => {
    try {
        const searchTerm = req.query.q?.toLowerCase();
        
        // If no search term provided, return all students
        if (!searchTerm) {
            const allStudents = await Student.findAll({
                order: [['id', 'ASC']]
            });
            return res.json(allStudents);
        }
        
        const students = await Student.findAll({
            where: {
                [Op.or]: [
                    // Convert id to string for text searching
                    sequelize.where(
                        sequelize.cast(sequelize.col('id'), 'varchar'),
                        { [Op.iLike]: `%${searchTerm}%` }
                    ),
                    { name: { [Op.iLike]: `%${searchTerm}%` } },
                ]
            },
            order: [['id', 'ASC']]
        });
        
        res.json(students);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Error during search operation" });
    }
};