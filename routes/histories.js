const express = require("express");
const historiesController = require("../controllers/histories");
const isAuth = require("../middlerware/auth");
const router = express.Router();

// get history by user id
router.get("/:userId", isAuth, historiesController.getHistory);

// get detail history
router.get("/detail/:orderId", isAuth, historiesController.getDetailHistory);

module.exports = router;
