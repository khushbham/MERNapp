const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const bucketUrl = process.env.BUCKET_URL;
const getSteamKey = process.env.GETSTREAM_KEY;
const getSteamSecret = process.env.GETSTREAM_SECRET;
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs");

const client = require("twilio")(accountSid, authToken);
const Dropdown = require("../../models/Dropdown");
const BookedClasses = require("../../models/BookedClasses");
const Classes = require("../../models/Classes");
const Availability = require("../../models/Availability");
const classDetailsSchema = require("../../models/ClassDetails");
const Categories = require("../../models/Categories");
const Tags = require("../../models/Tags");
const Wishlist = require("../../models/Wishlist");
const ScheduledAvailabilities = require("../../models/ScheduledAvailabilities");
const Notifications = require("../../models/Notifications");
const TeachersRating = require("../../models/TeachersRating");
const Class = require("../../models/Classes");
const ejs = require("ejs");
const pdf = require("html-pdf");
const multer = require("multer");
const Transaction = require("../../models/Transaction");
const CardDetails = require("../../models/CardDetails");
const AccountDetail = require("../../models/AccountDetail");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, (new Date().getTime() + file.originalname).replace(/\s+/g, ""));
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const region = "us-east-2";
const bucketName = process.env.BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

// @route    GET api/users/checkUserSwitchAccountStatus
// @desc     check if user already added professional details and topics or not
// @access   Private
router.get("/checkUserSwitchAccountStatus", auth, async (req, res) => {
  try {
    var userRecord = await User.findOne({
      _id: req.user.id,
      account_status: 1,
    });

    var studentProfileCompleted = false;
    var teacherProfileCompleted = false;
    if (!userRecord) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "Account does not exists",
            location: "body",
          },
        ],
      });
    } else {
      if (userRecord.profile_created) {
        studentProfileCompleted = true;
      }
      if (userRecord.expertise != "") {
        teacherProfileCompleted = true;
      }
      if(userRecord.profile_created && userRecord.user_created_by_admin == 1){
        studentProfileCompleted = true;
        teacherProfileCompleted = true;
      }
      return res.json({
        success: true,
        message: "Data fetched successfully.",
        data: {
          teacherProfileCompleted: teacherProfileCompleted,
          studentProfileCompleted: studentProfileCompleted,
        },
        user:userRecord
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      errors: [
        {
          msg: "Server error",
          param: "server",
          location: "body",
        },
      ],
    });
  }
});
module.exports = router;
