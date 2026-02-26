const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // removes extra spaces automatically
        },
        username: {
            type: String,
            required: true,
            unique: true, // no two users can have same username
            trim: true, 
            lowercase: true, // always saved in lowercase
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: { 
            type: String, 
            default: "", 
            trim: true 
        },
        country: { 
            type: String, 
            default: "", 
            trim: true 
        },
        profilePic: { 
            type: String, 
            default: "" 
        },
    },
    {
        timestamps: true, // auto adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("User", userSchema);