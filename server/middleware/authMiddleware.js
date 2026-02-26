const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // step 1 - check if token exists in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // step 2 - extract token from "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];
        }

        // step 3 - if no token found, reject request
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // step 4 - verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // step 5 - find user from decoded token and attach to req.user
        req.user = await User.findById(decoded.id).select("-password");

        // step 6 - move to next function (the actual controller)
        next();
    } catch (error) {
        res.send(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };