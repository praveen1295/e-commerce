const { Color } = require("../model/Color");

// Fetch all colors
exports.fetchColors = async (req, res) => {
  try {
    const colors = await Color.find({}).exec();

    const totalDocs = await Color.countDocuments().exec(); // Count documents using the Color model directly
    console.log("Colors:", colors, "Total Documents:", totalDocs);

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(colors);
  } catch (err) {
    console.error("Error fetching colors:", err);
    res.status(400).json({
      message: "An error occurred while fetching colors.",
      error: err.message,
    });
  }
};

// Create a new color
exports.createColor = async (req, res) => {
  const color = new Color(req.body);
  try {
    const doc = await color.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Update an existing color
exports.updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json(updatedColor);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Delete a color
exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedColor = await Color.findByIdAndDelete(id).exec();

    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({ message: "Color deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};
