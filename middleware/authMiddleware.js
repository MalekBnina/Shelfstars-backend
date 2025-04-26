const jwt = require("jsonwebtoken");

// Middleware to verify token and authenticate user
function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).send({ message: "Access Denied. No token provided." }); // If no token, return an error
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify the token
    console.log("✅ User verified:", decoded); // Log the decoded token (user info)
    req.user = decoded; // Store user data in request object
    next(); // Proceed to next middleware or route handler
  } catch (ex) {
    res.status(400).send({ message: "Invalid token." }); // If token is invalid, return an error
  }
}

// Middleware to check if user is an admin
function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) { // Check if user is authenticated and is an admin
    return res.status(403).send({ message: "Access Denied. Admins only." }); // Deny access if not an admin
  }
  next(); // Proceed to next middleware or route handler if the user is an admin
}

module.exports = { auth, adminOnly }; // Export the middleware functions
