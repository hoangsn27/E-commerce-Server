const express = require("express");
const commentController = require("../controllers/comment");
const isAuth = require("../middlerware/auth");
const router = express.Router();

router.get("/:idProduct", commentController.getComment);
router.post("/send", isAuth, commentController.postComment);

module.exports = router;
