const express = require("express");
const router = express.Router();
const { ensureAunthenticated, fowardAuthenticated } = require("../config/auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const emailvalidator = require("email-validator");
const valiDate = require("validate-date");

//Load models
const User = require("../models/User");
const Travel = require("../models/travel");

router.get("/", function (req, res) {
  User.findById(req.user._id, "Journey_id", async function (err, result) {
    if (err) console.log(err);
    else {
      var journeyDataArr = [];
      const journeyIdArr = result.Journey_id;
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
          accept: journeyData.accept,
          pending: journeyData.pending,
        });
      }
      res.render("request", { journeyDataArr: journeyDataArr });
    }
  });
});

router.post("/", jsonParser, async function (req, res) {
  const action = req.body.response;
  const journeyID = req.body.journeyID;
  const requesterEmail = req.body.requesterEmail;

  const Journey = await Travel.findById(journeyID).catch(console.error);
  const Noof = Journey.Noof;
  const currentNo = Journey.accept.length;
  console.log(Noof, typeof Noof, currentNo, typeof currentNo);
  if (currentNo == Noof) {
    console.log("Full"); // Full message should pop up and the pending array should empty
    res.redirect("request");
  } else if (action == "accept") {
    Travel.findByIdAndUpdate(journeyID, {
      $pull: { pending: requesterEmail },
      $push: { accept: requesterEmail },
    }).catch(console.error);
    res.redirect("request");
  } else {
    Travel.findByIdAndUpdate(journeyID, {
      $pull: { pending: requesterEmail },
    }).catch(console.error);
    res.redirect("request");
  }
});

module.exports = router;