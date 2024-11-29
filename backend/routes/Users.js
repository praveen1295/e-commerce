const express = require("express");
const {
  fetchUserById,
  fetchAllUsers,
  updateUser,
  searchUsers,
  fetchUseDetailById,
} = require("../controller/User");

const router = express.Router();
//  /users is already added in base path
router
  .get("/", fetchAllUsers)
  .get("/own", fetchUserById)
  .get("/user", fetchUseDetailById)
  .get("/search", searchUsers) // Add the route for searching users
  .patch("/:id", updateUser);

exports.router = router;
