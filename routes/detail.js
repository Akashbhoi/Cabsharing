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
  res.render("detail")
);

router.post('/', (req, res) => {
  let accept = [];
  let pending =[];
    const { Numberplate , phone_no, rate , Available } = req.body;
    let errors = [];
    req.body.email = req.user.email;
    if (phone_no.length != 10) {
      errors.push({ msg: 'Phone number is wrong!' });
    }  
    if (errors.length > 0) {
        res.render('detail', {
           errors,
           Numberplate ,
           phone_no,
           rate ,
           Available ,
           accept,
           pending
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
                accept,
                pending
            }); 
            newDriver.email = req.user.email;
            newDriver.Available = "Available";
            newDriver.save()
            res.redirect('/dashboarddriver');
        }
        });
          }
  });
  

module.exports = router;
