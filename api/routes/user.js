const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require('jsonwebtoken');

//get all users
router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((doc) => {
      const response = {
        users: doc.map((data) => {
          return {
            _id: data.id,
            firstName: data.firstName,
            email: data.email,
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

//create new user
router.post("/", async (req, res, next) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New user Created",
        User: {
          _id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//get single user
router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  console.log(id);
  User.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          user: doc,
          request: {
            type: "GET_ALL_USERS",
            url: "http://localhost:3000/user",
          },
        });
      } else {
        res.status(404).json({ message: "No User found for this ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//update user
router.patch("/:userId", async (req, res, next) => {
  try {
    const id = req.params.userId;
    const updateUser = await User.findByIdAndUpate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "updated user",
      user: updateUser,
      request: {
        type: "GET",
        url: "http://localhost:3000/user/" + id,
      },
    });
  } catch (e) {
    res.status(500).json({ error: err });
  }
});

//update password
router.patch("/:userId", async (req, res, next) => {});

//login user
router.post('/login', async(req,res,next)=>{
  const user = User.findOne({userName: req.body.userName});
  if(user){
    const token = jwt.sign({_id:this._id},'a3488ad5c31f289d63f30be96e98f62d4abd356a57a7402f4d10ba2b45edcaf85c7a2f6e7ed3d0d9add1c8969f0631dbe696362d2890ea086c0ae96ec03f2bb3', {expiresIn: '1d'});
    return res.status(200).json({
      userName: req.body.userName,
      token: token,
    })
  } else{
    res.status(401).json({ message: 'Invalid credentials' });
  }
})
//delete user
router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then((res) => {
      res.status(200).json({
        message: "User Deleted Succesfully!",
        request: {
          type: "POST",
          url: "http://localhost:3000/user",
          body: {
            firstName: "String",
            lastName: "String",
            email: "String",
            password: "String",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
