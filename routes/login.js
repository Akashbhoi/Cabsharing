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

router.get("/", forwardAuthenticated, (req, res) => res.render("login"));

router.post("/", (req, res, next) => {

  let a;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res, next);
    }else{
      if(user.required == "Student"){
        passport.authenticate("local", {
          successRedirect: "/dashboard",
          failureRedirect: "/login",
          failureFlash: true,
        })(req, res, next);
      }else if(user.required == "Driver"){
        Driver.findOne({
          email: req.body.email
        }).then(driver =>{
          if(!driver){
            passport.authenticate("local", {
              successRedirect: "/detail",
              failureRedirect: "/login",
              failureFlash: true,
            })(req, res, next);
          }else{
            passport.authenticate("local", {
              successRedirect: "/dashboarddriver",
              failureRedirect: "/login",
              failureFlash: true,
            })(req, res, next);
          }
        })



      }
    }
    
  });
      
});

module.exports = router;



