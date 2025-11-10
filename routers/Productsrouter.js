import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productscontroller.js";

const router = express.Router();

router.get("/productsmodel", getAllProducts);
router.post("/productsmodel", createProduct);
router.get("/productsmodel/:id", getProductById);
router.put("/productsmodel/:id", updateProduct);
router.delete("/productsmodel/:id", deleteProduct);

export default router;