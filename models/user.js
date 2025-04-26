const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    savedBooks: [
        { type: String }
    ],
    isAdmin: {
        type: Boolean,
        default: false, // Set to false by default for regular users
    }
});

// Method to generate JWT token for the user
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin }, // Include isAdmin in the payload
        process.env.JWTPRIVATEKEY,
        { expiresIn: "25d" }
    );
    return token;
};

// Define User model
const User = mongoose.model("User", userSchema);

// Validation schema for user registration
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = {
    User,
    validate,
};
