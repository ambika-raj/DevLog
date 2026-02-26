const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc register a new user
// @route POST/api/auth/register
const registerUser = async (req, res) => {
    try {
        // step 1 - get data from request body
        const { name, username, email, password } = req.body;

        // step 2 - check if all fields are provided
        if(!name || !username || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // step 3 - check if email or username already exists
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });

        if(userExists) {
            return res
                .status(400)
                .json({ message: "Email or username already taken" });
        }

        // step 4 - hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // step 5 - create new user in MongoDB
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword, // never save plain password
        });

        // step 6 - send back response with token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        // step 1 - get data from request body
        const { email, password } = req.body;

        // step 2 - check if all fields are provided
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // step 3 - find user by email
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // step 4 - compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // step 5 - send back response with token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get logged in user info
// @route GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe };