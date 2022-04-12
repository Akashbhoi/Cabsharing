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
const { findOneAndUpdate } = require("../models/User");
router.get("/", ensureAuthenticated, jsonParser, async function (req, res) {
  const journeyList = req.user.Journey_id;
  journeyList.forEach((journeyID) => {
    Travel.countDocuments({ _id: journeyID }, async function (err, count) {
      if (count == 0) {
        await User.updateOne(
          { _id: req.user._id },
          {
            $pull: { Journey_id: journeyID },
          }
        );
      }
    });
  });

  req.user.Journey_id_accept.forEach((journey_id) => {
    Travel.countDocuments({ _id: journey_id }, async function (err, count) {
      if (count == 0) {
        await User.updateOne(
          { _id: req.user._id },
          { $pull: { Journey_id_accept: journey_id } }
        );
      }
    });
  });
  res.render("dashboard", {
    user: req.user,
  });
});

module.exports = router;
