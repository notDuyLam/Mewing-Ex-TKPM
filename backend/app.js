const express = require("express");
const db = require('./models');
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// routing for student
app.use('/students', require('./components/student/student.routes'));

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(
        PORT,
        () => console.log(`Server running on port ${PORT}`)
    );
});