const express = require("express");
const router = express.Router();
const { User } = require("../models/user");  // User model
const { auth } = require("../middleware/authMiddleware");  // Auth middleware

// Route to save a book
router.post("/", auth, async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).send({ message: "Book ID is required." });
  }

  try {
    // Find the user based on the authenticated user ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if the book is already saved by the user
    if (user.savedBooks.includes(bookId)) {
      return res.status(400).send({ message: "Book is already saved." });
    }

    // Save the book ID to the user's savedBooks array
    user.savedBooks.push(bookId);
    await user.save();

    res.status(200).send({ message: "Book saved successfully!" });

  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
  }
});

// Route to get all saved books for the user
router.get("/", auth, async (req, res) => {
  try {
    // Find the user based on the authenticated user ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // If user has no saved books, return empty array
    if (!user.savedBooks || user.savedBooks.length === 0) {
      return res.status(200).send([]);
    }

    // Fetch book details from Google Books API for each saved book ID
    const savedBooks = [];
    
    // Process each book ID to get full book details
    for (const bookId of user.savedBooks) {
      try {
        // Since we're returning the data directly, we won't make actual API calls here
        // In a real scenario, you would fetch from Google Books API using axios
        savedBooks.push({
          bookId: bookId,
          title: "Book Title", // This would come from the API
          authors: ["Author Name"], // This would come from the API
          image: "https://i.pinimg.com/474x/f1/31/c5/f131c545376e2d6ce9563e7e4bb8d63d.jpg" // This would come from the API
        });
      } catch (error) {
        console.error(`Error fetching book ${bookId}:`, error);
      }
    }

    res.status(200).send(savedBooks);
  } catch (error) {
    console.error("Error fetching saved books:", error);
    res.status(500).send({ message: "Internal server error!" });
  }
});

module.exports = router;