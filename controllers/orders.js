const Order = require("../models/orders");
const User = require("../models/users");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Product = require("../models/products");

// save order to db and send user an email confirm order
exports.postOrder = async (req, res) => {
  const userId = req.body.userId;
  const email = req.body.email;
  const fullname = req.body.fullname;
  const phone = req.body.phone;
  const address = req.body.address;
  const payment = req.body.payment;
  const date = req.body.date;
  const total = req.body.total;
  const products = req.body.products;
  const status = 0;

  // save order to database
  const order = new Order({
    products: products,
    userId: userId,
    email: email,
    fullname: fullname,
    phone: phone,
    address: address,
    payment: payment,
    total: total,
    status: status,
    date: date,
  });
  order.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hoangmda2704@gmail.com",
      pass: "dupnkqyenlczuvoy",
    },
  });

  // send Email confirm order:

  const htmlHead =
    '<table style="width:50%">' +
    '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">Tên Sản Phẩm</th><th style="border: 1px solid black;">Hình Ảnh</th><th style="border: 1px solid black;">Giá</th><th style="border: 1px solid black;">Số Lượng</th><th style="border: 1px solid black;">Thành Tiền</th>';

  let htmlContent = "";

  for (let i = 0; i < products.length; i++) {
    htmlContent +=
      "<tr>" +
      '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
      products[i].productId.name +
      "</td>" +
      '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;"><img src="' +
      products[i].productId.img1 +
      '" width="80" height="80"></td>' +
      '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
      products[i].productId.price +
      "$</td>" +
      '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
      products[i].quantity +
      "</td>" +
      '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
      parseInt(products[i].productId.price) * parseInt(products[i].quantity) +
      "$</td><tr>";
  }

  const htmlResult =
    "<h1>Xin Chào " +
    fullname +
    "</h1>" +
    "<h3>Số điện thoại: " +
    phone +
    "</h3>" +
    "<h3>Địa chỉ:" +
    address +
    "</h3>" +
    "<h3>Phương thức thanh toán:" +
    payment +
    "</h3>" +
    "<h3>Thời gian đặt hàng:" +
    date.slice(0, 10) +
    "</h3>" +
    htmlHead +
    htmlContent +
    "<h1>Tổng Thanh Toán: " +
    total +
    "$</br>" +
    "<p>Cảm ơn bạn!</p>";

  await transporter.sendMail({
    to: email,
    from: "hoangmda2704@gmail.com",
    subject: "Confirm Your Order",
    html: htmlResult,
  });

  // clear user cart after order
  const user = await User.findById(userId);
  user.clearCart();
  //delete the number of products that have been ordered
  for (const key in products) {
    const product = await Product.findById(products[key].productId._id);
    const count = parseInt(product.count) - parseInt(products[key].quantity);
    product.count = count;
    product.save();
  }
  return res.json({ message: "ordered success" });
};
