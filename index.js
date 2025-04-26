require("dotenv").config();  // ✅ Load .env variables FIRST
const express = require("express");
const cors = require("cors");
const connection = require("./db.js"); // ✅ Connect to the database
const userRoutes = require("./routes/users.js"); // ✅ User routes
const authRoutes = require("./routes/auth"); // ✅ Auth routes
const bookRoutes = require("./routes/book"); // ✅ AddBook routes (for admin only)
const saveRoutes = require("./routes/saveRoutes.js"); // ✅ Save routes
const reviewRoutes = require('./routes/reviewRoutes'); // ✅ Review routes
const app = express();

// Connect to the database
connection();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Routes
app.use("/api/users", userRoutes); // ✅ User routes
app.use("/api/auth", authRoutes); // ✅ Auth routes
app.use("/api/book", bookRoutes); // ✅ AddBook routes (for admin only)
app.use("/api/save", saveRoutes); // ✅ Save routes
app.use("/api/reviews", reviewRoutes); // ✅ Review routes


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
