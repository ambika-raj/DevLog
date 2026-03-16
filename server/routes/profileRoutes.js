const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
// const upload = require("../utils/multer");
const { upload } = require('../utils/cloudinary')

router.get("/", protect, getProfile);
router.put("/", protect, upload.single("profilePic"), updateProfile);

module.exports = router;