const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productName: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model('Cart',cartSchema);