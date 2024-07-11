const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const userSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  _id: {
    type: String,
    default: uuidv4,
  },
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
