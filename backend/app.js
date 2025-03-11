const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/student");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/', studentRoutes);

// Sync database
sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized");
        
        // Start server after database sync
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(err => console.error("Error synchronizing database:", err));