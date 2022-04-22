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

router.post('/',jsonParser, (req, res) => {
 Driver.findById(req.body.id).then((driver) => {
    console.log(driver)
    if (!Array.isArray(driver.pending)) {
     driver.pending = [];
   }
   const pending = driver.pending;
    if (pending.indexOf(req.body.journeyID) == -1) {
      pending.push(req.body.journeyID);
      driver.save();
    }
    User.findById(req.user._id, "Journey_id_accept", async function (err, result) {
      if (err) console.log(err);
      else {
        var journeyDataArr = [];
        const journeyIdArr = result.Journey_id_accept;
        for (const journeyID of journeyIdArr) {
          const journeyData = await Travel.findById(journeyID).catch(
            console.error
          );
          if (!journeyData) continue;
          if(journeyData.Driver_id == ""){
            b = "";
         }else{
           b = journeyData.Driver_id;
         }
  
          journeyDataArr.push({
            _id: journeyData._id,
            Noof: journeyData.Noof,
            Gen: journeyData.Gen,
            origin: journeyData.origin,
            destination: journeyData.destination,
            Departuredate: journeyData.Departuredate,
            time: journeyData.time,
            accept: journeyData.accept,
            pending: journeyData.pending,
            driver: b
          });
        }
        res.render("journey", { journeyDataArr: journeyDataArr ,
       });
      }
    });
  
  });
});


module.exports = router;

