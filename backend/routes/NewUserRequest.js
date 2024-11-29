const express = require("express");
const {
  createNewUserRequest,
  fetchAllUserRequests,
  fetchUserRequestById,
  updateUserRequest,
} = require("../controller/NewUserRequest");

const router = express.Router();

router.post("/", createNewUserRequest);
router.get("/", fetchAllUserRequests);
router.get("/:id", fetchUserRequestById);
router.put("/:id", updateUserRequest);

exports.router = router;
