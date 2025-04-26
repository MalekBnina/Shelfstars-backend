const router = require("express").Router();
const Review = require("../models/review"); // Review model
const { auth } = require("../middleware/authMiddleware"); // Authentication middleware

// Submit a review
router.post("/:id", auth, async (req, res) => {
  try {
    if (!req.body.rating || !req.body.comment) {
      return res.status(400).send({ message: "Rating and comment are required." });
    }

    const newReview = new Review({
      user: req.user._id,
      bookId: req.params.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await newReview.save();
    res.status(201).send({ message: "Review submitted!" });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).send({ message: "Could not submit review." });
  }
});

// Get all reviews for a book
router.get("/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.id }).populate("user", "name");
    res.send(reviews);
  } catch (err) {
    res.status(500).send({ message: "Failed to get reviews." });
  }
});

module.exports = router;
