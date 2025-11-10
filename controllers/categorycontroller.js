import categorymodel from "../models/Categorymodel.js";

const getAllCategories = async (req, res) => {
    try {
        const categories = await categorymodel.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCategory = async (req, res) => {
    const category = new categorymodel(req.body);
    try {
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categorymodel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedCategory) {
            res.status(200).json({ success: true, data: updatedCategory });
        } else {
            res.status(404).json({ success: false, message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};  

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await categorymodel.findByIdAndDelete(req.params.id);
        if (deletedCategory) {
            res.status(200).json({ success: true, message: "Category deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };