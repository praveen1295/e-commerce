const { NewUserRequest } = require("../model/NewUserRequest");
const { User } = require("../model/User");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Controller to create a new user request
exports.createNewUserRequest = async (req, res) => {
  try {
    const { user, request_type, admin_notes } = req.body;

    // Validate user existence
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newUserRequest = new NewUserRequest({
      user,
      request_type,
      admin_notes,
    });

    await newUserRequest.save();

    res.status(201).json(newUserRequest);
  } catch (err) {
    console.error("Error creating new user request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to fetch all user requests with pagination, sorting, and filtering
exports.fetchAllUserRequests = async (req, res) => {
  try {
    const {
      _page = 1,
      _limit = 10,
      request_type,
      request_status,
      user,
      _sort,
      _order,
    } = req.query;

    const query = {};
    const sort = {};

    if (request_type) query.request_type = request_type;
    if (request_status) query.request_status = request_status;
    if (user) query.user = user;

    if (_sort) {
      sort[_sort] = _order === "desc" ? -1 : 1;
    }

    const page = parseInt(_page, 10);
    const limit = parseInt(_limit, 10);
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive integers" });
    }

    const totalDocs = await NewUserRequest.countDocuments(query).exec();

    const requests = await NewUserRequest.find(query)
      .populate("user") // Populate the user field
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to fetch a user request by ID

exports.fetchUserRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Convert the string id to a MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // const request = await NewUserRequest.findOne({ _id: id }).populate("user");

    const request = await NewUserRequest.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    ).populate("user"); // Populate the user field

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Error fetching user request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to update a user request
exports.updateUserRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRequest = await NewUserRequest.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    ).populate("user"); // Populate the user field
    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.status(200).json(updatedRequest);
  } catch (err) {
    console.error("Error updating user request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
