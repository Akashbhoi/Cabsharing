const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyParser = require("body-parser");
const emailvalidator = require("email-validator");
const validateDate = require("validate-date");
const jsonParser = bodyParser.json();
// Load User model
const User = require('../models/User');
const Travel = require('../models/travel');

// Profile
router.get('/', ensureAuthenticated, (req, res) =>
  res.render('profiledriver', {
    user: req.user
  })
);

router.post('/', (req, res) => {
  const { required, name, email, password, confirmpassword, gender, Hall, Room, Address, birthday, phone, profile_pic} = req.body;
  let errors = [];
  if (!gender ) {
    errors.push({ msg: 'Please enter Gender!' });
  }
  if ( !name ) {
    errors.push({ msg: 'Please enter Name!' });
  }
  if (phone.length != 10) {
    errors.push({ msg: 'Phone number is wrong!' });
  }  
  if(!(validateDate(req.body.birthday, responseType="boolean", dateFormat="dd/mm/yyyy"))){
    errors.push({ msg: 'Date format is wrong!' });
  }
  if (errors.length == 0) {
  User.findOneAndUpdate({ email: req.body.email }, req.body, { new: true }, (err, doc) => {
      if (!err) { req.flash('success_msg', 'Successfully update'); res.redirect('/profiledriver'); }
  });
} else { 
  res.render("profiledriver", {
    errors,
    user: req.body
});
  }
});

module.exports = router;