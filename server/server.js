const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const publicRoutes = require("./routes/publicRoutes");
const profileRoutes = require("./routes/profileRoutes");
const noteRoutes = require("./routes/noteRoutes");

// load environment variables from .env file
dotenv.config();

// connect to mongoDB
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json()); // this lets use read json data from request body
app.use("/uploads", express.static("uploads")); // this serves uploaded images as static files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notes", noteRoutes);

// test route
app.get("/", (req, res) => {
    res.send("DevLog API is running...");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});