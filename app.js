import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import vuserrouter from "./routers/vuserrouter.js";
import authrouer from "./routers/authrouter.js";
import Productsrouter from "./routers/Productsrouter.js";
import categoryrouter from "./routers/categoryrouter.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
connectDB();

// ✅ Routes
app.use("/api/auth", authrouer);     // Register/Login
app.use("/api", vuserrouter);         // CRUD routes

// products k liya 
app.use("/api", Productsrouter);
// categories  k liya 
app.use("/api", categoryrouter);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


export default app;