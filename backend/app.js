const express = require("express");
const db = require('./models');
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// routing for student
app.use('/students', require('./components/student/student.routes'));
// routing for student details
app.use('/student-details', require('./components/student/studentDetails/studentDetails.routes'));
// routing for indentiy documents
app.use('/identity-documents', require('./components/student/identityDocuments/identityDocuments.routes'));

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(
        PORT,
        () => console.log(`Server running on port ${PORT}`)
    );
});