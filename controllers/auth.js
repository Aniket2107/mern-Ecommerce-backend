const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const ExpressJwt = require('express-jwt');
const User = require('../models/user');
require('dotenv').config();

exports.signup = (req,res) => {
 
  //Validation before storing 
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) return res.status(422).json({err : errors.array()[0].msg, prms : errors.array()[0].param});

  const user = new User(req.body);
  user.save((err,user) => {
    if(err) return res.status(400).json({err : 'Error saving file in DB'});
    res.json({
      name:user.name,
      email:user.email,
      id:user._id
    });
  });
} 

exports.signin = (req,res) => {
   const {email , password} = req.body;
   const errors = validationResult(req);
  
  if(!errors.isEmpty()) return res.status(422).json({err : errors.array()[0].msg, prms : errors.array()[0].param});

  User.findOne({email}, (err,user) => {
    if(err) return res.status(400).json({'error':err});

    if(!user) return res.status(400).json({'error' : 'User not found'});

    if(!user.authenticate(password)){
      return res.status(401).json({'error': 'Email and password not found'});
    }
   
    //Create token
    const token = jwt.sign({_id:user._id},process.env.SECRET);

    //Token in cookie
     res.cookie('token', token , {expire: new Date() + 999});

    //Send response to frontend
    const {_id,name,email,role} = user;  
    return res.json({token, user: {_id,name,email,role}});
  });  
}

exports.signout = (req,res) => {
     res.clearCookie('token');
    res.json({
        message: 'Signout sucessfully..'
    });
}

//Proteced routes
exports.isSignedIn = ExpressJwt({
  secret : process.env.SECRET,
  userProperty: 'auth'
});

//Custom midleware
exports.isAuthenticated = (req,res,next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
   
  if(!checker)
      return res.status(403).json({error : 'Access Denied'});
  next();
}

exports.isAdmin = (req,res,next) => {
   if(req.profile.role === 0)
     return res.status(403).json({error: 'you are not admin'});
  next();
}