const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
   name:{
      type: String,
      required: true,
      trim: true 
   },
   lastname:{
      type: String,
      trim: true,
   },
   email:{
      type: String,
      required: true,
      unique : true
   },
   userinfo:{
      type: String,
      trim: true
   },
   encry_password:{
      type: String,
      required: true
   },
   salt: String,
   role:{
      type: Number,
      default : 0
   },
   purchases:{
       type: Array,
       default : []
   } 
 },
   {timestamps: true}
);

userSchema.virtual('password')
   .set(function(password){
      this._password = password;
      this.salt = uuidv1();
      this.encry_password = this.securePassword(password);
   })    
   .get(function(){
      return this._password;
   });

userSchema.methods = {
   authenticate: function(password){
      return this.securePassword(password) === this.encry_password;
   },

   securePassword: function(plainpassword){
      if(!plainpassword) return  "";
       try{
         return crypto
            .createHmac('sha256',this.salt)
            .update(plainpassword)
            .digest('hex');
       }catch(err){
           return "";
       }

   }
}

module.exports = mongoose.model('User', userSchema);
