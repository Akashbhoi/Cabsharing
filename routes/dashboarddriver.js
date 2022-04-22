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

router.get("/",ensureAuthenticated, function (req, res) {
  Driver.findOne({ email: req.user.email } , async function (err, driver)  {
    if (!driver) console.log(err);
    else {
      var journeyDataArr = [];
      const journeyIdArr = driver.pending;
      for (const journeyID of journeyIdArr) {
        const journeyData = await Travel.findById(journeyID).catch(
          console.error
        );

        if (!journeyData) continue;

        journeyDataArr.push({
          _id: journeyData._id,
          Noof: journeyData.Noof,
          origin: journeyData.origin,
          destination: journeyData.destination,
          Departuredate: journeyData.Departuredate,
          time: journeyData.time,
          accept: journeyData.accept,
          pending: driver.pending,        
        });
      }
      res.render("dashboarddriver", { journeyDataArr: journeyDataArr });
    }
  });
});

router.post("/", jsonParser, async function (req, res) {
  const action = req.body.response;
  const journeyID = req.body.journeyID;

   if (action == "accept") {
    Driver.findOneAndUpdate({
      email:req.user.email
    }, {
      $pull: { pending: journeyID },
      $push: { accept: journeyID },
    }).catch(console.error);
     Travel.findById(journeyID, async function(err, travel ) {
      if (err) {
          return res.send({
              error: err
          });
      }
      travel.Driver_id = req.user.email;
      travel.save()
    });   
    res.redirect("dashboarddriver");
  } else {
    Driver.findOneAndUpdate({
      email:req.user.email
    }, {
      $pull: { pending: journeyID },
    }).catch(console.error);
    res.redirect("dashboarddriver");
  }

});


module.exports = router;
