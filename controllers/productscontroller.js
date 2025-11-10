import productsmodel from "../models/productsmodel.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await productsmodel
      .find()
      .populate("category", "name") // ✅ populate category name
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createProduct = async (req, res) => {
  try {
    const product = new productsmodel(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product, message: "Product created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productsmodel.findById(req.params.id);
    if (product) {
      res.status(200).json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productsmodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.status(200).json({ success: true, data: updatedProduct, message: "Product updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productsmodel.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct };