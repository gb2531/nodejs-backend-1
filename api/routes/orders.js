const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate('product', 'name price')
    .exec()
    .then((doc) => {
      res.status(200).json({
        count: doc.length,
        orders: doc.map((docs) => {
          return {
            _id: docs._id,
            product: docs.product,
            quantity: docs.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + docs._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      order.save().then((result) => {
        res.status(201).json({
          message: "order created",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id,
          },
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "product not found", error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
  .populate('product')
    .exec()
    .then((result) => {
      if(!result){
       return res.status(404).json({
        message: 'order not found'
       });
      }
      res.status(200).json({
        order: result,
        request: {
          type: "GET",
          utl: "http://localhost:3000/orders",
        },
      });
    }).catch(err=>{
      res.status(500).json({error:err})
    })
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Order Deleted",
        request:{
            type: 'POST',
            url: 'http://localhost:3000/Orders',
            bosy: {product: 'productId', Quantity: 'Number'}
        }
      });
    });
});

module.exports = router;
