const express = require("express");
const {
  getMessage,
  sendMessage,
} = require("../controller/messageController.js");
const { isAuth } = require("../services/common");

const router = express.Router();

router
  .post("/send/:id", isAuth(), sendMessage)
  .get("/:id", isAuth(), getMessage);

exports.router = router;
