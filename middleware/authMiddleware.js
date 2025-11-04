import jwt from "jsonwebtoken";
import User from "../models/vusermodel.js"; // ✅ keep your correct model name

export const protect = async (req, res, next) => {
  let token;

  // ✅ 1. Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ✅ 2. Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // ✅ 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ 4. Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ 5. Proceed to next middleware
      next();

    } catch (error) {
      console.error("Auth error:", error);

      // ✅ ADD THIS BELOW — (after the catch block starts)
      // Helps frontend detect if token is expired
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }

      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    // ✅ 6. If no token found
    res.status(401).json({ message: "No token, authorization denied" });
  }
};
