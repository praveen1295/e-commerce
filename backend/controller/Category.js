const { Category } = require("../model/Category");

// Fetch all categories
exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    const totalDocs = await Category.countDocuments().exec(); // Count documents using the Category model directly
    console.log("Categories:", categories, "Total Documents:", totalDocs);

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(400).json({
      message: "An error occurred while fetching categories.",
      error: err.message,
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id).exec();

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};
