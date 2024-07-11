const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const authenticationToken = require("../middleware/auth");

router.get("/", authenticationToken, (req, res, next) => {
  Cart.find()
    .exec()
    .then((doc) => {
      const response = {
        cart: doc.map((data) => {
          return {
            _id: data._id,
            productName: data.productName,
            quantity: data.quantity,
          };
        }),
      };
      if (doc.length > 0) {
        res.status(200).json({ response });
      } else {
        res.status(404).json({ message: "No users found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", authenticationToken, (req, res, next) => {
  const cart = new Cart({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    quantity: req.body.quantity,
  });
  console.log(cart);
  cart
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "product added to cart",
        Cart: {
          _id: result._id,
          productName: result.productName,
          quantity: result.quantity,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:cartId", (req, res, next) => {
  const id = req.params.cartId;
  Cart.deleteOne({ _id: id })
    .exec()
    .then((res) => {
      res.status(200).json({
        message: "Product deleted from cart successfully!",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
