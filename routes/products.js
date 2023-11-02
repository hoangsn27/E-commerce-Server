const express = require("express");
const productsController = require("../controllers/products");

const router = express.Router();

// get all product
router.get("/", productsController.getProducts);

// get detail product by id
router.get("/:id", productsController.getDetailProduct);

// get category product
router.get("/category", productsController.getCategory);

// get pagination
router.get(
  "/pagination/:category:count:page:search",
  productsController.getPagination
);

module.exports = router;
