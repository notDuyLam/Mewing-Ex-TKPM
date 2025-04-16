const db = require("../../models");
const Staff = db.Staff;
const Department = db.Department;

const createStaff = async (req, res) => {
    try {
        const { name, departmentId } = req.body;
        if (!name || !departmentId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!name.length || !departmentId.length) {
            return res.status(400).json({ error: "Fields cannot be empty" });
        }
        if (departmentId) {
            const department = await Department.findByPk(departmentId);
            if (!department) {
                return res.status(404).json({ error: "Department not found" });
            }
        }
        const staff = await Staff.create({ name, departmentId });
        res.status(201).json(staff);
    } catch (error) {
        res.status(500).json({ error: "Failed to create staff" });
    }
}

const updateStaff = async (req, res) => {
    try {
        const { staffId } = req.params;
        const { name, departmentId } = req.body;
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            return res.status(404).json({ error: "Staff not found" });
        }
        if (departmentId) {
            const department = await Department.findByPk(departmentId);
            if (!department) {
                return res.status(404).json({ error: "Department not found" });
            }
        }
        const updateData = {
            name: name || staff.name,
            departmentId: departmentId || staff.departmentId
        }
        await staff.update(updateData);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: "Failed to update staff" });
    }
}

const deleteStaff = async (req, res) => {
    try {
        const { staffId } = req.params;
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            return res.status(404).json({ error: "Staff not found" });
        }
        await staff.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete staff" });
    }
}

const getAllStaffs = async (req, res) => {
    try {
        const staffs = await Staff.findAll();
        res.status(200).json(staffs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch staffs" });
    }
}

const getStaffById = async (req, res) => {
    try {
        const { staffId } = req.params;
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            return res.status(404).json({ error: "Staff not found" });
        }
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch staff" });
    }
}

module.exports = { createStaff, updateStaff, deleteStaff, getAllStaffs, getStaffById };