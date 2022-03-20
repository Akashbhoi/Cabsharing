const express = require('express');

const multer = require('multer');

const User = require('../models/User');

const storageConfig = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storageConfig });
const router = express.Router();

router.post('/profilepic', upload.single('image'), async function(req,res) {
    const uploadedImageFile = req.file;
    const profile_pic = uploadedImageFile.path;

    // User.collection('users').insertOne({
    //     imagePath:uploadedImageFile.path
    // });

    const emailForPic = req.user.email;

    User.findOneAndUpdate({ email: emailForPic }, {profile_pic: profile_pic}, { new: true }, (err, doc) => {
        req.flash('success_msg', 'Successfully update');
        
    const user = User.find({email: emailForPic});

        return res.render("profile",{ user: user });
    });

});

module.exports = router;

