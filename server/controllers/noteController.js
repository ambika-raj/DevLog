const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      user: req.user.id,
      title: req.body.title || "Untitled Note",
      content: req.body.content || "",
      color: req.body.color || "#1e293b",
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

    note.title = req.body.title !== undefined ? req.body.title : note.title;
    note.content = req.body.content !== undefined ? req.body.content : note.content;
    note.color = req.body.color !== undefined ? req.body.color : note.color;

    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };