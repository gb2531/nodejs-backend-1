const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const joi = require('joi');


const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
    unique: true
  },
  lastName: {
    type: String,
    required: true,
  },
    userName: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true
  }, 
  password: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('User', userSchema)
