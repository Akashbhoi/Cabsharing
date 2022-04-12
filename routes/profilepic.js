const express = require("express");

const multer = require("multer");
const fs = require("fs");
const User = require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });
const router = express.Router();

router.post("/profilepic", upload.single("image"), async function (req, res) {
  const uploadedImageFile = req.file;
  const profile_pic = uploadedImageFile.path;
  console.log(profile_pic, " is the path !");

  const emailForPic = req.user.email;

  try {
    const toBeRemovedFile = req.body["prev-profile-pic"];
    fs.unlinkSync(toBeRemovedFile);
  } catch (err) {
    console.log(err);
  }

  User.findOneAndUpdate(
    { email: emailForPic },
    { profile_pic: profile_pic },
    { new: true },
    (err, doc) => {
      req.flash("success_msg", "Successfully update");

      res.redirect("profile");
    }
  );
});

module.exports = router;
