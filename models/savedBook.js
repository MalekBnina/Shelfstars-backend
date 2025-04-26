const mongoose = require("mongoose");

const savedBookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: false },
  authors: [{ type: String }],
  description: { type: String },
  image: { type: String },
  savedAt: { type: Date, default: Date.now }
});

// Add an index for faster lookups
savedBookSchema.index({ user: 1, bookId: 1 }, { unique: true });

const SavedBook = mongoose.model("SavedBook", savedBookSchema);

module.exports = { SavedBook };