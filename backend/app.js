const express = require("express");
const db = require('./models');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routing for student
app.use('/students', require('./components/student/student.routes'));

db.sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});