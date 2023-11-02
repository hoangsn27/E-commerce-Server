const express = require("express");
const cartController = require("../controllers/carts");
const isAuth = require("../middlerware/auth");

const router = express.Router();

// get cart by user id
router.get("/:userId", isAuth, cartController.getCart);

// add to cart
router.post("/add", isAuth, cartController.postAddToCart);

// delete an product in cart
router.post("/delete", isAuth, cartController.postDeleteCart);

// update a product in cart
router.post("/update", isAuth, cartController.postUpdateCart);

module.exports = router;
