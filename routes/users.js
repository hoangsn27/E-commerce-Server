const express = require("express");

const { check, query, body } = require("express-validator");

const User = require("../models/users");
const router = express.Router();

const authController = require("../controllers/users");

// signup new account
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Hãy Nhập E-mail Hợp Lệ")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail Đã Tồn Tại, Hãy Chọn Một E-mail Khác"
            );
          }
        });
      })
      .normalizeEmail(),
    query("password", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postSignup
);

// login
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    query("password", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

// get username to show in client
router.get("/:userId", authController.getUsername);

router.get("/user/:userId", authController.getUser);
router.post(
  "/update",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),

    body("fullname", "Độ Dài Fullname Tối Thiểu 3 Ký Tự")
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body("phone", "Độ Dài Số Điện Thoại Là 10 Ký Tự")
      .isLength({ min: 10 })
      .isNumeric()
      .trim(),
  ],
  authController.postUpdateUser
);

router.post(
  "/changepassword",
  [
    body("oldPassword", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 6 })
      .trim(),
    body("newPassword", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự")
      .isLength({ min: 6 })
      .trim(),
    body("confirmNewPassword", "Độ Dài Mật Khẩu Tối Thiểu 6 Ký Tự ")
      .isLength({ min: 6 })
      .trim(),
  ],
  authController.postChangePassword
);

module.exports = router;
