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


//Travelform
router.get('/', ensureAuthenticated, (req, res) =>
  res.render('travelform', {
    user: req.user
  })
);

router.post('/', (req, res) => {

  const {   origin,         posted_by,
    email, destination, Noof, Gen, Departuredate,time } = req.body;
  let errors = [];
  let accept = [];
  let pending =[];
  if (!origin || !destination || !Noof || !Gen || !Departuredate || !time) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (errors.length > 0) {
    res.render('travelform', {
      errors,
      origin,
      posted_by,
      email,
      destination,
      Noof,
      Gen,
      Departuredate,
      accept,
      pending,
      time
    });
  } else {

        const newTravel = new Travel({
        origin,
        posted_by,
        email,
        destination,
        Noof,
        Gen,
        accept,
        pending,
        Departuredate,
        time
        }); 
        newTravel.posted_by = req.user.name;
        newTravel.email = req.user.email;  
        newTravel.Departuredate = newTravel.Departuredate ;
        newTravel.accept.push(req.user.email);
        let a = newTravel._id;
        newTravel.save()
        User.findOne({
          email: req.user.email
      }, async function(err, user) {
          if (err) {
              return res.send({
                  error: err
              });
          }
          user.Journey_id.push(a);
          user.Journey_id_accept.push(a);
          user.save()
        });
         req.flash('success_msg', 'Successfully submitted');res.redirect('/travelform');  
        
      }
    });

    module.exports = router;