const router = require("express").Router();  // Import the router from Express
const { User, validate } = require("../models/user.js");  // Import User model and validation function
const bcrypt = require("bcrypt");  // Import bcrypt for password hashing
const { auth, adminOnly } = require("../middleware/authMiddleware");  // Import auth and adminOnly middleware

// Register route for user registration
router.post("/register", async (req, res) => {  // Removed auth and adminOnly middleware here
    try {
        const { error } = validate(req.body);  // Validate request body
        if (error) {
            return res.status(400).send({ message: error.details[0].message });  // Return validation error
        }

        // Ensure that only an admin can set `isAdmin`
        let isAdmin = false;
        if (req.body.email.toLowerCase() === "youremail@email.com") { // Replace with actual admin email
            isAdmin = true;
        }

        // Check if the user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({ message: "User with given email exists!" });  // Return conflict error if user exists
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the isAdmin field (defaults to false unless provided)
        const newUser = new User({
            ...req.body,  // Spread the request body into the new user document
            password: hashPassword,  // Set the hashed password
            isAdmin  // Set the isAdmin field (either true or false)
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).send({ message: "User created successfully!" });  // Return success response

    } catch (error) {
        res.status(500).send({ message: "Internal server error!" });  // Return internal server error
    }
});

module.exports = router;  // Export the router
