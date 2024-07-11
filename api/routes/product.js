const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/products");
const authenticationToken = require('../middleware/auth')

router.get("/", authenticationToken,(req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      if (doc.length > 0) {
        res.status(200).json({ response });
      } else {
        res.status(404).json({ message: "No data found under products" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/",authenticationToken, (req, res, next) => {
  const procuct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  procuct
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result.id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", authenticationToken,(req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET_ALL_PRODUCTS",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid data found for the product ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// router.patch("/:productId", (req, res, next) => {

//   Product.findByIdAndUpdate(_id,req.body)
//     .exec()
//     .then((result) => {
//       res.status(200).json(result);
//     }).catch(err=>{
//         res.status(500).json({error: err})
//     })
// });

router.patch("/:productId", authenticationToken, async (req, res) => {
  try {
    const _id = req.params.productId;
    const updateProducts = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "updated products",
      product: updateProducts,
      request: {
        type: "GET",
        url: "http://localhost:3000/products/" + _id,
      },
    });
  } catch (e) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:productId",authenticationToken, (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/produts",
          bosy: { name: "String", price: "Number" },
        },
      });
    });
});

module.exports = router;
