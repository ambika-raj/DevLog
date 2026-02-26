const express = require("express");
const router = express.Router();
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");
const { project, protect } = require("../middleware/authMiddleware");
const upload = require("../utils/multer");

// All routes are protected
router.post("/", protect, upload.single("thumbnail"), createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProject);
router.put("/:id", protect, upload.single("thumbnail"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;