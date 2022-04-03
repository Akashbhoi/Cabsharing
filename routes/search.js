const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const bodyParser = require("body-parser");
const emailvalidator = require("email-validator");
const validateDate = require("validate-date");
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
// Load User model
const User = require("../models/User");
const Travel = require("../models/travel");

function modify(journeyList) {
  journeyList.forEach((element) => {
    element._id = new mongoose.Types.ObjectId(element._id);
    element.date = new Date(element.date);
    element.Departuredate = new Date(element.Departuredate);
  });
  return journeyList;
}

function deleteJourney(journeyList, journey) {
  var ans = -1;
  for (var i = 0; i < journeyList.length; i++) {
    if (journeyList[i]._id == journey._id) {
      ans = i;
      break;
    }
  }
  return ans;
}

router.get("/",ensureAuthenticated, function (req, res) {
  //i have to add authentication in this feild (Akash Kumar Bhoi)
  res.render("search", { isPost: false, user: req.user });
});

router.post("/", jsonParser, function (req, res) {
  const fromGET = req.body.fromGET;
  if (fromGET) {
    const destination = new RegExp(req.body.destination, "i")
    const date = req.body.date;
    const origin = new RegExp(req.body.origin, "i")
    if (destination != "" && date != "" && origin != "") {
      Travel.find({
        destination: destination,
        Departuredate: date,
        origin: origin,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination != "" && date == "" && origin != "") {
      Travel.find({
        destination: destination,
        origin: origin,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination == "" && date != "" && origin != "") {
      Travel.find({
        Departuredate: date,
        origin: origin,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination != "" && date != "" && origin == "") {
      Travel.find({
        destination: destination,
        Departuredate: date,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination == "" && date != "" && origin == "") {
      Travel.find({
        Departuredate: date,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination == "" && date == "" && origin != "") {
      Travel.find({
        origin: origin,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (destination != "" && date == "" && origin == "") {
      Travel.find({
        destination: destination,
        email: { $ne: req.user.email },
      })
        .then((result) => {
          var filterResult = result.filter(function (element) {
            return element.accept.length < element.Noof;
          });
          res.render("search", {
            isPost: true,
            data: filterResult,
            user: req.user,
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    } else {
      res.redirect("search");
    }
  } else {
    var journeyList = modify(JSON.parse(req.body.journeyList)); // the data type of Departuredate and date changed to string
    const journeyID = req.body.journeyID;

    Travel.findById(journeyID).then((journey) => {
      const pending = journey.pending;
      if (pending.indexOf(req.user.email) == -1) {
        pending.push(req.user.email);
        journey.save();
      }
      //i have to remove the already requested one
      var newJourneyList = journeyList.filter(function (element) {
        return element._id != journeyID;
      });
      res.render("search", { isPost: true, data: newJourneyList });
    });
  }
});

module.exports = router;
