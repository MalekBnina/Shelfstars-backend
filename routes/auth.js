const router = require("express").Router();
const { User } = require("../models/user.js"); // Ensure your User model has 'isAdmin' field
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Generate token (make sure 'generateAuthToken' includes isAdmin)
        const token = user.generateAuthToken();

        // Send response with token and isAdmin status
        res.status(200).send({
            data: { token, isAdmin: user.isAdmin },  // Send isAdmin in the response
            message: "Logged in successfully!"
        });

    } catch (error) {
        res.status(500).send({ message: "Internal server error!" });
    }
});

module.exports = router;
