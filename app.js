const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const authRoutes = require("./api/routes/auth");

mongoose.connect(
  "mongodb+srv://devuser:nodeshop@node-shop.ivgtopa.mongodb.net/?retryWrites=true&w=majority&appName=node-shop"
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-control-Allow-Headers",
    "origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

// routes to handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

//handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
