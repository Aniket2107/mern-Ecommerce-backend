const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name:{
       type: String,
       required: true,
       maxlength: 50,
       unique: true,
       trim: true
   }

},{timestamps:true});



module.exports = mongoose.model('Category', categorySchema );