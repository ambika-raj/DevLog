const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Note", trim: true },
    content: { type: String, default: "", trim: true },
    color: { type: String, default: "#1e293b" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);