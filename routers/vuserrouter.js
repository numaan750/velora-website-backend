import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/vusercontroller.js";

const router = express.Router();

router.get("/vusermodel", getAllUsers);
router.get("/vusermodel/:id", getUserById);
router.put("/vusermodel/:id", updateUser);
router.delete("/vusermodel/:id", deleteUser);

export default router;
