const {User} = require("../models/users");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async(req,res,next)=>{
    try{
        console.log(req.body.userName)
        const user = await User.findOne({userName: req.body.userName});
        console.log(user)
        if(!user) return res.status(400).json({Message: 'Invalid userName'});

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        console.log(validPassword,'fsdf')
        if(!validPassword) return res.status(400).json({message: 'Invalid Password'});
        const token = user.generateAuthToken();
        console.log(token)
        return res.status(200).json({
            userName: user.userName,
            token: token
        })
    }catch(error){
        res.status(500).json({error:error})
    }
});

const validate = (user) =>{
    const schema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = router;