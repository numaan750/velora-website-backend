import express from "express";
import { loginUser, registerUser, getUserProfile, verifyToken, updateUserProfile, updateEmail, changePassword, deleteAccount, sendResetCode, verifyResetCode, resetPasswordWithCode, } from "../controllers/authcontroller.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ ADD THIS LINE


const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", protect, updateUserProfile); 
router.put("/change-email", protect, updateEmail);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
// router.post("/reset-password-direct", directResetPassword);

router.post("/send-reset-code", sendResetCode);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password-with-code", resetPasswordWithCode);




export default router;
