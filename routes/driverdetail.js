const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const bodyParser = require("body-parser");
const emailvalidator = require("email-validator");
const validateDate = require("validate-date");
const jsonParser = bodyParser.json();
// Load User model
const User = require("../models/User");
const Travel = require("../models/travel");
const Driver = require("../models/driver");
router.get("/", ensureAuthenticated, (req, res) =>
Driver.findOne({ email: req.user.email }).then(driver => {
  if(driver){
  res.render("driverdetail", {
    user: req.user,   
    driver : driver
  })
}else{
  const driver = new Driver({
    Numberplate : "",
    phone_no : "",
    rate : "",
    Available : "",
    Booked : ""
  }); 
  driver.email = req.user.email
  res.render("driverdetail", {
    user: req.user, 
    driver : driver 
  }) 
}
})
);

router.post('/', (req, res) => {
    const { Numberplate , phone_no, rate , Available , Booked , email} = req.body;
    let errors = [];
    req.body.email = req.user.email;
    if (phone_no.length != 10) {
      errors.push({ msg: 'Phone number is wrong!' });
    }  
    if (errors.length > 0) {
        res.render('travelform', {
           errors,
           Numberplate ,
           phone_no,
           rate ,
           Available ,
           Booked
        });
      } else {
        Driver.findOne({ email: req.user.email }).then(user => {
            if(user){
                Driver.findOneAndUpdate({ email: req.user.email }, req.body, { new: true }, (err, doc) => {
                    if (!err) { req.flash('success_msg', 'Successfully update'); res.redirect('/driverdetail'); }
                });               

            }else{
            const newDriver = new Driver({
                Numberplate ,
                phone_no,
                rate ,
                Available ,
                Booked
            }); 
            newDriver.email = req.user.email;
            newDriver.save()
            res.redirect('/driverdetail');
        }
        });
          }
  });
  

module.exports = router;
