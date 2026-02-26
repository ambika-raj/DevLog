const User = require("../models/User");

// @desc Get profile
// @route GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update profile
// @route PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, country } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.country = country !== undefined ? country : user.country;

    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };