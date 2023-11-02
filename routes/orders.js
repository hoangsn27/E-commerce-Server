const express = require("express");
const orderController = require("../controllers/orders");
const isAuth = require("../middlerware/auth");
const router = express.Router();

// post order
router.post("/", isAuth, orderController.postOrder);

module.exports = router;
