const Messenger = require("../models/session");

// get all chat room on admin website
exports.getAllRoom = async (req, res) => {
  const rooms = await Messenger.find();

  return res.json(rooms);
};

// get message by room id
exports.getMessageByRoomId = async (req, res) => {
  const roomId = req.query.roomId;
  if (!roomId) {
    return;
  }
  const messenger = await Messenger.findById(roomId);

  return res.json(messenger);
};

// create a new room
exports.postCreateNewRoom = async (req, res) => {
  const room = new Messenger({ content: [] });
  room.save();
  return res.json(room);
};

// add message to db when user send message
exports.postAddMessage = async (req, res) => {
  const roomId = req.body.roomId;
  const isAdmin = req.body.is_admin;
  const message = req.body.message;

  if (!roomId) {
    return;
  }

  const data = {
    isAdmin: isAdmin,
    message: message,
  };

  const room = await Messenger.findById(roomId);
  room.content.push(data);
  room.save();

  return res.json({ message: "message send" });
};
