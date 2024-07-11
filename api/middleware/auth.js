const jwt = require('jsonwebtoken')

const authenticationToken = async(req,res,next) =>{
    const token = req.header('Authorization');
    
    if(!token) return res.status(401).json({message: 'Access Denied'});

    jwt.verify(token, 'a3488ad5c31f289d63f30be96e98f62d4abd356a57a7402f4d10ba2b45edcaf85c7a2f6e7ed3d0d9add1c8969f0631dbe696362d2890ea086c0ae96ec03f2bb3',(err,user)=>{
        if(err) return res.status(403).json({message: 'Invalid Token'});

        req.user = user;
        next()
    });
};

module.exports = authenticationToken;