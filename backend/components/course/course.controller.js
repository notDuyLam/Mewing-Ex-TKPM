const db = require("../../models");
const Course = db.Course;
const Class = db.Class;

const createCourse = async (req, res) => {
    try {
        const { courseId, courseName, credits, departmentId, description, preCourseId } = req.body;

        if (!courseId || !courseName || !credits || !departmentId, !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        if (!courseId.length || !courseName.length || !credits.length || !departmentId.length || !description.length) {
            return res.status(400).json({ message: 'Fields cannot be empty' });
        }
        // Kiểm tra course ID
        if (await Course.findOne({ where: { courseId } })) {
            return res.status(400).json({ message: 'CourseId is existed' });
        }
        // Số tín chỉ phải >= 2
        if (credits && credits < 2) {
            return res.status(400).json({ message: 'Credits must be greater than 1' });
        }
        // Kiểm tra môn tiên quyết
        if (preCourseId) {
            const isPreCourseExist = await Course.findOne({ where: { courseId: preCourseId } });
            if (!isPreCourseExist) {
                return res.status(400).json({ message: 'PreCourseId is not existed' });
            }
        }

        const newCourse = await Course.create({
            courseId,
            courseName,
            credits,
            departmentId,
            preCourseId,
            description,
            status: 'activate'
        });
        return res.status(201).json({
            message: 'Course created successfully',
            data: newCourse
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Can not create course',
            error: error.message
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Chỉ có thể xóa khóa học nếu chưa có lớp được tạo
        // Nếu đã có lớp, chuyển status sang deactive
        const classes = await Class.findAll({ where: { courseId } });
        if (classes.length > 0) {
            await course.update({ status: 'deactivate' });
            return res.status(200).json({ message: 'Course status changed to deactive successfully' });
        }

        // Chỉ có thể xóa khóa học kể từ khi tạo 30 phút
        const now = new Date();
        const createdAt = course.createdAt;
        const diffTime = Math.abs(now - createdAt);
        const minutes = Math.ceil(diffTime / (1000 * 60));
        if (minutes > 30) {
            return res.status(400).json({ message: 'Can not delete course since it was created more than 30 minutes ago' });
        }

        await course.destroy();
        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting course',
            error: error.message
        });
    }
};

const activeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.update({ status: 'activate' });
        return res.status(200).json({ message: 'Course status changed to active successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error active course',
            error: error.message
        });
    }
}

const getStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json({ status: course.status });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving course status',
            error: error.message
        });
    }
}

const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseName, credits, departmentId, preCourseId, description } = req.body;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (credits || preCourseId) {
            const classes = await Class.findAll({ where: { courseId } });
            if (classes.length > 0) {
                return res.status(400).json({ message: 'Can not update course credits/preCourse since it has classes' });
            }
        }
        const updateData = {
            courseName: courseName || course.courseName,
            credits: credits || course.credits,
            departmentId: departmentId || course.departmentId,
            description: description || course.description,
            preCourseId: preCourseId || course.preCourseId,
        }
        await course.update(updateData);
        return res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating course',
            error: error.message
        });
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving courses',
            error: error.message
        });
    }
}

const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving course',
            error: error.message
        });
    }
}

module.exports = {
    createCourse,
    deleteCourse,
    activeCourse,
    updateCourse,
    getStatus,
    getAllCourses,
    getCourseById
};

