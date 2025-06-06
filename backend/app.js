const express = require("express");
const db = require('./models');
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing for student
app.use('/students', require('./components/student/student.routes'));
// routing for student details
app.use('/student-details', require('./components/student/studentDetails/studentDetails.routes'));
// routing for indentiy documents
app.use('/identity-documents', require('./components/student/identityDocuments/identityDocuments.routes'));

// routing for departments
app.use('/departments', require('./components/department/department.routes'));
// routing for programs
app.use('/programs', require('./components/program/program.routes'));
// routing for statuses
app.use('/statuses', require('./components/status/status.routes'));
// routing for courses
app.use('/courses', require('./components/course/course.routes'));
// routing for classes
app.use('/classes', require('./components/class/class.routes'));
// routing for enrollments
app.use('/enrollments', require('./components/enrollment/enrollment.routes'));
// routing for staff
app.use('/staff', require('./components/staff/staff.routes'));
// routing for semesters
app.use('/semesters', require('./components/semester/semester.routes'));
// routing for teachers
app.use('/teachers', require('./components/teacher/teacher.routes'));


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(
        PORT,
        () => console.log(`Server running on port ${PORT}`)
    );
});