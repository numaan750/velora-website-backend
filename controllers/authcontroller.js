import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/vusermodel.js";

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      country,
      city,
      postalcode,
      address,
      phone,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      country,
      city,
      postalcode,
      address,
      phone,
    });

    await newUser.save();

    // Return user data (excluding password)
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        country: newUser.country,
        city: newUser.city,
        postalcode: newUser.postalcode,
        address: newUser.address,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Middleware: Verify JWT Token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied, no token!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // save verified user info
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // hide password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, phone, country, city, address, postalcode } = req.body; // lowercase

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { username, phone, country, city, address, postalcode },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update profile" });
  }
};

// ✅ UPDATE USER EMAIL
export const updateEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newEmail } = req.body;

    if (!newEmail)
      return res.status(400).json({ message: "New email is required" });

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Old and new password are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // create token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenHash = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     // save token + expiry
//     user.resetPasswordToken = resetTokenHash;
//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
//     await user.save();

//     // reset URL (frontend page)
//     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

//     // Send email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "linkplayer613@gmail.com", // <-- apna Gmail daalna
//         pass: "jipb knqg uzar rvcq", // <-- ek hi line me likhna (no space, no enter)
//       },
//     });

//     await transporter.sendMail({
//       from: '"Your App" <youremail@gmail.com>',
//       to: user.email,
//       subject: "Password Reset Request",
//       html: `
//         <p>Hello ${user.username || ""},</p>
//         <p>Click below to reset your password. This link expires in 15 minutes:</p>
//         <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//       `,
//     });

//     res.json({ message: "Password reset email sent!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error sending reset email" });
//   }
// };

// // 🔹 Reset Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: tokenHash,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user)
//       return res.status(400).json({ message: "Invalid or expired token" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.json({ message: "✅ Password has been reset successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error resetting password" });
//   }
// };

// // ✅ Direct Reset Password by Email (without token)
// export const directResetPassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;

//     if (!email || !newPassword)
//       return res.status(400).json({ message: "Email and new password required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     // hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: "✅ Password updated successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error resetting password" });
//   }
// };

// ✅ STEP 1 — Send Reset Code to Email


export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 6-digit random code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash code and set expiry
    user.resetPasswordToken = crypto.createHash("sha256").update(resetCode).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email with code
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "linkplayer613@gmail.com",
        pass: "jipb knqg uzar rvcq",
      },
    });

    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to: email,
      subject: "Your Password Reset Code",
      html: `
        <p>Hello ${user.username || "User"},</p>
        <p>Your password reset code is:</p>
        <h2>${resetCode}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "✅ Code sent to your email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending reset code" });
  }
};

// ✅ STEP 2 — Verify Reset Code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    res.json({ message: "✅ Code verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error verifying code" });
  }
};

// ✅ STEP 3 — Reset Password With Code
export const resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "✅ Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error resetting password" });
  }
};
