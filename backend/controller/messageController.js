const { Conversation } = require("../model/ConversationModel.js");
const { Message } = require("../model/MessageModel.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    console.log("senderId,receiverId,message", senderId, receiverId, message);

    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    // SOCKET IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    console.log(error);
  }
};
