const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/users");
const Messenger = require("./models/session");
const multer = require("multer");
const path = require("path");
const Order = require("./models/orders");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p6svwef.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
app.use(cors());

// storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// filter format file upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");
const historiesRoutes = require("./routes/histories");
const adminRoutes = require("./routes/admin");
const sessionRoutes = require("./routes/session");
const commentRoutes = require("./routes/comment");

app.use(express.urlencoded({ extended: true }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).array("images")
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/histories", historiesRoutes);
app.use("/admin", adminRoutes);
app.use("/chatrooms", sessionRoutes);
app.use("/comment", commentRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = app.listen(5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log(`client connected, socketID:${socket.id}`);
      // server receives the "send_message" key submitted by the user
      socket.on("send_message", (data) => {
        // server sends back to client via socket with key "receive_message"
        socket.broadcast.emit("receive_message");
      });
      socket.on("send_order", (data) => {
        socket.broadcast.emit("receive_order", data);
      });
      socket.on("confirm_order", (data) => {
        const updateOrder = async () => {
          const order = await Order.findById(data);
          order.status = 1;
          order.save();
        };
        updateOrder();

        socket.broadcast.emit("receive_status");
      });
      socket.on("cancle_order", (data) => {
        const updateOrder = async () => {
          const order = await Order.findById(data);
          order.status = 0;
          order.save();
        };
        updateOrder();

        socket.broadcast.emit("receive_status");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
