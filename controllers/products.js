const Product = require("../models/products");

// get all product:
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
};

// get product by id
exports.getDetailProduct = async (req, res) => {
  const id = req.query.id;
  try {
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};

// get product by category
exports.getCategory = async (req, res) => {
  const category = req.query.category;
  try {
    const products = await Product.find({ category: category });
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
};

// pagination function
exports.getPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const numberProduct = parseInt(req.query.count) || 1;
  const keyWordSearch = req.query.search;
  const category = req.query.category;

  // take the first and last product:
  const start = (page - 1) * numberProduct;
  const end = page * numberProduct;

  let products = [];

  // set product when category is all
  if (category === "all") {
    products = await Product.find();
  }
  //  set product when user chosse a category
  else {
    products = await Product.find({ category: category });
  }
  const paginationProducts = products.slice(start, end);

  // response if search keyword is empty
  if (!keyWordSearch) {
    return res.json(paginationProducts);
  }

  // Return products according to user search
  else {
    var newData = paginationProducts.filter((value) => {
      return (
        value.name.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
        value.price.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
        value.category.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
      );
    });

    return res.json(newData);
  }
};
