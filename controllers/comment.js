const User = require("../models/users");
const Product = require("../models/products");
const Comment = require("../models/comment");

exports.getComment = async (req, res) => {
  const idProduct = req.query.idProduct;
  const commentProduct = await Comment.find({ idProduct: idProduct });

  return res.json(commentProduct);
};
exports.postComment = async (req, res) => {
  const idProduct = req.query.idProduct;
  const idUser = req.query.idUser;
  const content = req.query.content;
  const date = req.query.date;
  const star = parseInt(req.query.star);

  console.log(idProduct, idUser, date, content, star);

  const user = await User.findById(idUser);
  let arrayStar = [];

  // Tạo array cho star
  for (let i = 0; i < star; i++) {
    arrayStar.push("fas fa-star text-warning");
  }

  let star1 = "";
  let star2 = "";
  let star3 = "";
  let star4 = "";
  let star5 = "";

  // Bắt đầu gán vào star
  for (let i = 0; i < arrayStar.length; i++) {
    if (i === 0) {
      star1 = arrayStar[i];
    }
    if (i === 1) {
      star2 = arrayStar[i];
    }
    if (i === 2) {
      star3 = arrayStar[i];
    }
    if (i === 3) {
      star4 = arrayStar[i];
    }
    if (i === 4) {
      star5 = arrayStar[i];
    }
  }

  const newComment = new Comment({
    idProduct: idProduct,
    idUser: idUser,
    fullname: user.fullname,
    content: content,
    date: date,
    star1: star1,
    star2: star2,
    star3: star3,
    star4: star4,
    star5: star5,
  });
  newComment.save();
  return res.json({ message: "Success" });
};
