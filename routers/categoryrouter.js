import express from "express";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categorycontroller.js";



const router = express.Router();



router.get("/categorymodel", getAllCategories);
router.post("/categorymodel", createCategory);
router.put("/categorymodel/:id", updateCategory);
router.delete("/categorymodel/:id", deleteCategory);


export default router;