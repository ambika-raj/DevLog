const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // this links project to a user
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        techStack: {
            type: [String], // array of a string e.g. ["React", "Node"]
            default: [],
        },
        status: {
            type: String,
            enum: ["In Progress", "Completed", "On Hold"], // only these 3 values allowed
            default: "In Progress",
        },
        githubLink: {
            type: String,
            trim: true,
            default: "",
        },
        liveLink: {
            type: String,
            trim: true,
            default: "",
        },
        thumbnail: {
            type: String, // stores the file path e.g. /uploads/filename.jpg
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);