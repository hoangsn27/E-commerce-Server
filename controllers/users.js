const User = require("../models/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// sign up
exports.postSignup = (req, res, next) => {
  const fullname = req.query.fullname;
  const email = req.query.email;
  const password = req.query.password;
  const phone = req.query.phone;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json({
      errorMessage: error.array()[0].msg,
      status: 422,
    });
  }

  // Encrypt password and save to database
  bcrypt
    .hash(password, 12)
    .then((pass) => {
      const user = new User({
        fullname: fullname,
        email: email,
        password: pass,
        phone: phone,
        cart: {
          items: [],
        },
      });
      return user.save();
    })
    .then(() => {
      res.json({ message: "Đăng Ký Thành Công", status: 200 });
    })
    .catch((err) => {
      console.log(err);
    });
};

// login
exports.postLogin = (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json({ message: error.array()[0].msg, statusCode: 422 });
  }
  // find user with email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.json({
          message: "Tài Khoản Hoặc Mật Khẩu Không Đúng",
          statusCode: 422,
        });
      }
      // compare two passwords
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            "secretKey",
            { expiresIn: "3h" }
          );
          return res.json({
            token: token,
            userId: user._id.toString(),
            statusCode: 200,
          });
        }
        return res.json({
          message: "Tài Khoản Hoặc Mật Khẩu Không Đúng",
          statusCode: 422,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// get username to show in frontend
exports.getUsername = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    return res.json(user.fullname);
  } catch {
    (err) => {
      console.log(err);
    };
  }
};
exports.getUser = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    const data = {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    };
    return res.json(data);
  } catch {
    (err) => {
      console.log(err);
    };
  }
};

exports.postUpdateUser = async (req, res) => {
  const userId = req.body.userId;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const phone = req.body.phone;

  const error = validationResult(req);

  const user = await User.findById(userId);

  if (user.email !== email) {
    const existsEmail = await User.find({ email: email });
    if (existsEmail) {
      return res.json({
        message: "E-mail Đã Tồn tại, Hãy Chọn Một E-mail Khác",
        statusCode: 401,
      });
    }
  }

  if (!error.isEmpty()) {
    return res.json({ message: error.array()[0].msg, statusCode: 422 });
  }

  await User.findOneAndUpdate(
    { _id: userId },
    { fullname: fullname, email: email, phone: phone }
  );

  return res.json({
    message: "Bạn Đã Cập Nhật Thông Tin Cá Nhân Thành Công",
    statusCode: 200,
  });
};

exports.postChangePassword = async (req, res) => {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmNewPassword = req.body.confirmNewPassword;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json({ message: error.array()[0].msg, statusCode: 422 });
  }

  const user = await User.findById(userId);

  const doMatch = await bcrypt.compare(oldPassword, user.password);

  if (doMatch) {
    if (newPassword !== confirmNewPassword) {
      return res.json({
        message: "Xác Nhận Mật Khẩu Cần Trùng Khớp",
        statusCode: 401,
      });
    }
    bcrypt.hash(newPassword, 12).then((newp) => {
      user.password = newp;
      user.save();
      return res.json({
        message: "Mật Khẩu Đã Được Thay Đổi Thành Công",
        statusCode: 200,
      });
    });
  } else {
    return res.json({ message: "Sai Mật Khẩu", statusCode: 401 });
  }
};
