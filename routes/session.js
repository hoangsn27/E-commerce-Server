const express = require("express");
const sessionController = require("../controllers/session");
const router = express.Router();

// get all chat room on admin web
router.get("/getAllRoom", sessionController.getAllRoom);

// get chat room by id
router.get("/:roomId", sessionController.getMessageByRoomId);

// create new chat room
router.post("/createNewRoom", sessionController.postCreateNewRoom);

// add new message to chat room
router.post("/addMessage", sessionController.postAddMessage);

module.exports = router;
