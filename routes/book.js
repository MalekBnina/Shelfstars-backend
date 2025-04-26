const express = require('express');
const { Book } = require('../models/book');  // Assuming you have a Book model
const { auth, adminOnly } = require("../middleware/authMiddleware"); // Import auth and adminOnly middleware

const router = express.Router();

// Route for fetching all books (accessible to everyone)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();  // Fetch all books from the database
    res.send(books);  // Send the books list as the response
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch books." });
  }
});

// Route for adding a book (only accessible to admins)
router.post("/add", auth, adminOnly, async (req, res) => {
  const { title, author, description, imageUrl } = req.body;

  // Log the user to see if the auth middleware is adding req.user correctly
  console.log("Authenticated User: ", req.user);  // Debugging line

  // Create new book entry
  try {
    const book = new Book({
      title,
      author,
      description,
      imageUrl,
    });

    await book.save();
    res.status(201).send({ message: "Book added successfully!", book });
  } catch (error) {
    res.status(500).send({ message: "Failed to add book." });
  }
});

module.exports = router;
