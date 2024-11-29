const { BankDetails } = require("../model/BankDetails");

// Fetch all bank details for the logged-in user
exports.fetchAllBankDetails = async (req, res) => {
  let condition = {};

  try {
    const bankDetails = await BankDetails.find({});
    let totalBankDetailsQuery = BankDetails.find(condition);
    // if (bankDetails.length === 0) {
    //   return res.status(404).json({ message: "No bank details found." });
    // }

    const totalDocs = await totalBankDetailsQuery.countDocuments().exec();
    res.set("X-Total-Count", totalDocs);

    res.status(200).json(bankDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching bank details.",
      error: error.message,
    });
  }
};

exports.fetchBankDetailsById = async (req, res) => {
  console.log("eq.params.id", req.params.id);
  try {
    const bankDetail = await BankDetails.findById(req.params.id);
    if (!bankDetail) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(bankDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create new bank details for the logged-in user
exports.createBankDetails = async (req, res) => {
  try {
    const bankDetails = new BankDetails({ ...req.body });
    const savedDetails = await bankDetails.save();
    res.status(201).json(savedDetails);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "An error occurred while creating bank details.",
      error: error.message,
    });
  }
};

// Update bank details by ID
exports.updateBankDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const bankDetails = await BankDetails.findById(id);
    if (!bankDetails) {
      return res.status(404).json({ message: "Bank details not found." });
    }
    // if (bankDetails.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Unauthorized access." });
    // }

    const updatedBankDetails = await BankDetails.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Bank details updated successfully.",
      updatedBankDetails,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      message: "An error occurred while updating bank details.",
      error: error.message,
    });
  }
};

// Delete bank details by ID
exports.deleteBankDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const bankDetails = await BankDetails.findById(id);
    if (!bankDetails) {
      return res.status(404).json({ message: "Bank details not found." });
    }
    // if (bankDetails.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Unauthorized access." });
    // }

    const deletedBankDetails = await BankDetails.findByIdAndDelete(id);
    res.status(200).json({
      message: "Bank details deleted successfully.",
      deletedBankDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "An error occurred while deleting bank details.",
      error: error.message,
    });
  }
};
