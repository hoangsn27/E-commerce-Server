const express = require("express");
const isAuth = require("../middlerware/auth");

const { check, query, body } = require("express-validator");

const User = require("../models/users");
const router = express.Router();

const authAdminController = require("../controllers/admin");

// get all user
router.get("/", authAdminController.getUsers);

// get all history
router.get("/all/:userId", authAdminController.getAllHistory);

// admin login
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Hãy Nhập E-mail Hợp Lệ")
      .normalizeEmail(),
    query("password", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authAdminController.postLogin
);

// get username
router.get("/:userId", authAdminController.getUsername);

// add a new product
router.post(
  "/addproduct",
  isAuth,
  [
    body("name", "Tên Sản Phẩm Cần Dài Trên 3 Ký Tự")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Giá Sản Phẩm Phải Một Là Số").isFloat(),
    body("category", "Thể Loại Sản Phẩm Cần Trên 3 Ký Tự")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("quantity", "Số Lượng Sản Phẩm Phải Một Là Số").isNumeric().trim(),
  ],

  authAdminController.postAddProduct
);

// update a product
router.post(
  "/updateproduct",
  isAuth,
  [
    body("name", "Tên Sản Phẩm Có Độ Dài Trên 3 Kí Tự")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Giá Của Sản Phẩm Phải Là Một Số").isFloat(),
    body("category", "Thể Loại Sản Phẩm Có Độ Dài Trên 3 Kí Tự")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("quantity", "Số Lượng Của Sản Phẩm Phải Là Một Số").isNumeric().trim(),
  ],

  authAdminController.postUpdateProduct
);

// delete a product
router.delete(
  "/deleteproduct/:productId:userId",
  isAuth,
  authAdminController.deleteProduct
);

// reset password client:
router.post(
  "/resetpassword",
  isAuth,
  [
    body("password", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authAdminController.postResetPassword
);
// delete account:
router.delete(
  "/deleteaccount/:userId",
  isAuth,
  authAdminController.deleteAccount
);
module.exports = router;
