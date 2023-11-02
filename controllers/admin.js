const User = require("../models/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/products");
const Order = require("../models/orders");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

// get all history on admin website
exports.getAllHistory = async (req, res, next) => {
  const history = await Order.find();
  return res.json(history);
};

// post login request on admin website
exports.postLogin = (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;
  const error = validationResult(req);

  //response if user missing requied fields
  if (!error.isEmpty()) {
    return res.json({ message: error.array()[0].msg, statusCode: 422 });
  }

  // find user in db
  User.findOne({ email: email })
    .then((user) => {
      //response when do not find the user
      if (!user) {
        return res.json({
          message: "Sai Tài Khoản Hoặc Mật Khẩu",
          statusCode: 422,
        });
      }
      //response when user role is client. do not have permission to access the website
      if (user.role.isClient) {
        return res.json({
          message: "Bạn Không Được Phép Truy Cập Trang Web Này",
          statusCode: 401,
        });
      }

      // accept login when user role is admin or support
      if (user.role.isAdmin || user.role.isSupport) {
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
              fullname: user.fullname,
              statusCode: 200,
            });
          }
          return res.json({
            message: "Sai Tài Khoản Hoặc Mật Khẩu",
            statusCode: 422,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//get username when admin login website
exports.getUsername = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    if (user.role.isAdmin) {
      return res.json({ name: user.fullname, role: "admin" });
    }
    if (user.role.isSupport) {
      return res.json({ name: user.fullname, role: "support" });
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
};

// add a new product from admin page
exports.postAddProduct = async (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const shortDesc = req.body.shortDesc;
  const longDesc = req.body.longDesc;
  const quantity = req.body.quantity;
  const images = req.files;

  const errors = validationResult(req);

  const user = await User.findById(userId);
  if (!user.role.isAdmin) {
    return res.json({ message: "Bạn Không Phải Admin", statusCode: 401 });
  }

  // response when images file is missing or wrong format
  if (!images) {
    return res.json({
      message: "File Được Chọn Không Phải Là Ảnh!",
      statusCode: 422,
    });
  }

  //response when admin missing required fields
  if (!errors.isEmpty()) {
    return res.json({ message: errors.array()[0].msg, statusCode: 422 });
  }
  const img1 = `http://localhost:5000/${images[0].path}`;
  const img2 = `http://localhost:5000/${images[1].path}`;
  const img3 = `http://localhost:5000/${images[2].path}`;
  const img4 = `http://localhost:5000/${images[3].path}`;

  // add new product do database and response to admin
  const newProduct = new Product({
    name: name,
    price: price,
    category: category,
    short_desc: shortDesc,
    long_desc: longDesc,
    count: quantity,
    img1: img1,
    img2: img2,
    img3: img3,
    img4: img4,
  });

  await newProduct.save();
  return res.status(200).json({ message: "Thêm Thành Công", statusCode: 200 });
};

//update product
exports.postUpdateProduct = async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const shortDesc = req.body.shortDesc;
  const longDesc = req.body.longDesc;
  const count = req.body.quantity;

  const errors = validationResult(req);

  const user = await User.findById(userId);
  if (!user.role.isAdmin) {
    return res.json({ message: "You are not Admin", statusCode: 401 });
  }

  if (!errors.isEmpty()) {
    return res.json({ message: errors.array()[0].msg, statusCode: 422 });
  }

  await Product.findOneAndUpdate(
    { _id: productId },
    {
      name: name,
      price: price,
      category: category,
      short_desc: shortDesc,
      long_desc: longDesc,
      count: count,
    }
  );
  return res.json({ message: "Cập Nhật Sản Phẩm Thành Công", statusCode: 200 });
};

// delete product:
exports.deleteProduct = async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;

  const user = await User.findById(userId);
  if (!user.role.isAdmin) {
    return res.json({ message: "You are not Admin", statusCode: 401 });
  }

  if (!productId) {
    return res.json({ message: "Missing Product Id", statusCode: 422 });
  }

  await Product.deleteOne({ _id: productId });

  return res.json({
    message: "Sản Phẩm Đã Được Xóa Thành Công",
    statusCode: 200,
  });
};

// reset password user:
exports.postResetPassword = async (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ message: errors.array()[0].msg, statusCode: 422 });
  }

  const user = await User.findById(userId);

  const newPassword = await bcrypt.hash(password, 12);

  user.password = newPassword;
  user.save();
  return res.json({
    message: "Mật Khẩu Khách Hàng Đã Được Cập Nhật ",
    statusCode: 200,
  });
};
// delete account:
exports.deleteAccount = async (req, res) => {
  const userId = req.query.userId;

  await User.deleteOne({ _id: userId });

  return res.json({
    message: `Tài Khoản ${userId} Đã Bị Xóa`,
    statusCode: 200,
  });
};
