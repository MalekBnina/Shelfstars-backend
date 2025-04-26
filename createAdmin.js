require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("./models/user");

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const existingAdmin = await User.findOne({ email: "youremail@email.com" }); // Replace with actual admin email

  if (existingAdmin) {
    console.log("Admin user exists. Updating...");
    // Update the user to set isAdmin to true
    existingAdmin.isAdmin = true;
    await existingAdmin.save();
    console.log("Admin user updated!");
  } else {
    // Create the admin if it doesn't exist
    const hashedPassword = await bcrypt.hash("password", 10); // Replace "password" with the actual password you want to set
    const admin = new User({
      firstName: "firstName", // Replace with actual first name
      lastName: "lastName", // Replace with actual last name
      email: "youremail@email.com", // Replace with actual email
      password: hashedPassword,
      isAdmin: true,
    });
    await admin.save();
    console.log("Admin user created!");
  }

  mongoose.disconnect();
})
.catch(err => console.log(err));
