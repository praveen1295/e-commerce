const { Category } = require("../model/Category");
const { User } = require("../model/User");
const { sendMail } = require("../services/common");

exports.fetchAllUsers = async (req, res) => {
  try {
    // Destructure and set default values for query parameters
    const {
      _page = 1,
      _limit = 10,
      user_category,
      user_status,
      phone_number,
      role = "user",
      _sort,
      _order,
    } = req.query;

    // Initialize the query object and sort object
    const query = {};
    const sort = {};

    // Add filters to the query object if they exist
    if (role) query.role = role;
    if (user_category) query.user_category = user_category;
    if (user_status) query.user_status = user_status;
    if (phone_number) query.phone_number = phone_number;

    // Add sorting to the sort object if _sort and _order exist
    if (_sort) {
      sort[_sort] = _order === "desc" ? -1 : 1; // Default order is ascending
    }

    // Validate pagination parameters
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive integers" });
    }

    // Get total count of documents
    const totalDocs = await User.countDocuments(query).exec();

    // Execute query with sorting and pagination
    const users = await User.find(query)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // Set total count header and send response
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "No search query provided" });
    }

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { user_category: { $regex: query, $options: "i" } },
      ],
    };

    const users = await User.find(searchQuery);

    // Calculate GST included discount prices

    res.status(200).json(users);
  } catch (err) {
    console.error("Error searching for users:", err);
    res
      .status(400)
      .json({ message: "Error searching for users", error: err.message });
  }
};

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      id: user.id,
      name: user.name,
      phoneNumber: user.phone_number,
      gender: user.gender,
      gstNumber: user.gst_number,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
      user_category: user.user_category,
      thumbnail: user.thumbnail,
      status: user.user_status,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchUseDetailById = async (req, res) => {
  const { userId: id } = req.query;

  try {
    const user = await User.findById(id);

    // Make a copy of the user object and remove the resetPasswordToken
    const userObj = user.toObject();
    delete userObj.resetPasswordToken;
    delete userObj.salt;
    delete userObj.password;

    res.status(200).json(userObj);
    // res.status(200).json({
    //   id: user.id,
    //   name: user.name,
    //   phoneNumber: user.phone_number,
    //   gender: user.gender,
    //   gstNumber: user.gst_number,
    //   addresses: user.addresses,
    //   email: user.email,
    //   role: user.role,
    //   user_category: user.user_category,
    //   thumbnail: user.thumbnail,
    //   status: user.user_status,
    // });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { user_status, user_category } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (user.email) {
      let subject = "Account Update Notification";
      let html = "";

      if (user_status) {
        html += `<p>Your account status has been updated to: <strong>${user_status}</strong>.</p>`;
      }

      if (user_category) {
        html += `<p>Your account category has been changed to: <strong>${user_category}</strong>.</p>`;
      }

      if (html) {
        const response = await sendMail({ to: user.email, subject, html });
        return res.json({ message: "Updated successfully", response });
      }
    }

    res.status(200).json({ message: "Updated successfully", user });
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key error (E11000)
      res.status(409).json(err);
    } else res.status(400).json(err);
  }
};

// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { user_status, user_category } = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(id, req.body, { new: true });

//     if ((user_status || user_category) && user.email) {
//       const subject = "password successfully reset for ecommerce";
//       const html = `<p>Successfully able to Reset Password</p>`;
//       if (user_status) {
//         const response = await sendMail({ to: email, subject, html });
//         res.json(response);
//       } else {
//         res.sendStatus(400);
//       }
//     }

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
