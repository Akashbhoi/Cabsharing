const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    required: {
        type: String,
        required: true
    },
   name: {
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
   },
   gender: {
    type: String,
    required: true
   },
   Hall: {
    type: String,
   },
   Room: {
    type: String,
   },  
   Address: {
    type: String,
   },
   birthday: {
    type: Date,
   },
   phone: {
    type: String,
   },
   profile_pic: {
    type: String,
   },
   Journey_id :[
      {
        type: String, ref: 'Travel'
      }
   ],
   Journey_id_accept :[
    {
      type: String, ref: 'Travel'
    }
 ],
   date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
