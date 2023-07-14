const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
//const accountSid = process.env.TWILIO_ACCOUNT_SID;
const stripeKey = process.env.STRIPE_SECRET_KEY;
//const authToken = process.env.TWILIO_AUTH_TOKEN;
const bucketUrl = process.env.BUCKET_URL;
const getSteamKey = process.env.GETSTREAM_KEY;
const getSteamSecret = process.env.GETSTREAM_SECRET;
const appID = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;
const messageBirdKey = process.env.MESSAGEBIRD_LIVE_KEY;
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs");
var path = require("path");
const stripe = require("stripe")(stripeKey);
const StreamChat = require("stream-chat").StreamChat;
const axios = require("axios");
const serverClient = StreamChat.getInstance(getSteamKey, getSteamSecret);
const {
  RtcTokenBuilder,
  //RtmTokenBuilder,
  RtcRole,
  //RtmRole,
} = require("agora-access-token");

// const client = require("twilio")(accountSid, authToken);
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
const Payouts = require("../../models/Payouts");
const PayoutsDetails = require("../../models/PayoutsDetails");
const RefundRequests = require("../../models/RefundRequests");
const Contacts = require("../../models/Contacts");
const ejs = require("ejs");
const pdf = require("html-pdf");
const multer = require("multer");
const Transaction = require("../../models/Transaction");
const CardDetails = require("../../models/CardDetails");
const AccountDetail = require("../../models/AccountDetail");
const ReportClass = require("../../models/ReportClass");
const ReportUser = require("../../models/ReportUser");
const messagebird = require("messagebird")(messageBirdKey);
const Helper = require("./helper/helper");
const NotificationsSettings = require("../../models/NotificationsSettings");
const NotificationSettingsRecords = require("../../models/NotificationSettingsRecords");
const Commission = require("../../models/Commission");
var cron = require("node-cron");

//for send the otp
const otpFunction = async (msg, phone) => {
  var params = {
    originator: "+12067047522",
    recipients: [`+1${phone}`],
    body: msg,
  };
  messagebird.messages.create(params, function (err, response) {
    if (err) {
      console.log("errr", err);
    }
    console.log("message bird success res", response);
  });
};

//for the push notification
const { initializeApp } = require("firebase-admin/app");
var admin = require("firebase-admin");
const serviceAccount = require("../../firebase.json");
const UserToken = require("../../models/UserToken");
const ClassDetails = require("../../models/ClassDetails");
const CancelClass = require("../../models/CancelClass");

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "",
});

router.post("/register", (req, res) => {
  tokens.push(req.body.token);
  res.status(200).json({ message: "Successfully registered FCM Token!" });
});

//check every mint if someone have class to push the notification
cron.schedule("*/1 * * * *", async () => {
  // router.get('/TestNotiAgain' , async(req ,res) => {
  var thirtyMinutesLater = new Date();
  var checkClassOnThisTime = thirtyMinutesLater.setMinutes(
    thirtyMinutesLater.getMinutes() + 30
  );
  var getYear = new Date(checkClassOnThisTime).getFullYear();
  var getMonth = new Date(checkClassOnThisTime).getMonth() + 1;
  var getDay = new Date(checkClassOnThisTime).getDate();
  var getHours = new Date(checkClassOnThisTime).getHours();
  var getMint = new Date(checkClassOnThisTime).getMinutes();
  var getMINTS = (getMint < 10 ? "0" : "") + getMint;
  var matchTimetoClass = `${getHours}:${getMINTS}`;
  console.log("wrking after 1 mint", matchTimetoClass);
  console.log("Class details", getYear, getMonth, getDay, matchTimetoClass);
  //get the all class
  var getTodaysClass = await classDetailsSchema.aggregate([
    {
      $match: {
        day_of_class: getDay,
        month_of_class: getMonth,
        year_of_class: getYear,
        start_time_of_class: matchTimetoClass,
        deleted : 0
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "created_by",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              teacherName: "$first_name",
            },
          },
        ],
        as: "TeacherDetail",
      },
    },
    {
      $unwind: "$TeacherDetail",
    },
    {
      $lookup: {
        from: "booked_classes",
        localField: "_id",
        foreignField: "session_id",
        pipeline: [
          {
            $project: {
              booked_by: "$booked_by",
            },
          },
        ],
        as: "bookedBy",
      },
    },
    {
      $unwind: "$bookedBy",
    },
    {
      $lookup: {
        from: "users",
        localField: "bookedBy.booked_by",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              studentName: "$first_name",
            },
          },
        ],
        as: "studentDetail",
      },
    },
    {
      $unwind: "$studentDetail",
    },
  ]);
  // to check the booked class result
  // return res.json({
  //   data : getTodaysClass
  // })
  var countRes = [];
  if (getTodaysClass.length > 0) {
    //for only the teacher
    var studentName = getTodaysClass[0].studentDetail.studentName;
    var teacherName = getTodaysClass[0].TeacherDetail.teacherName;
    var className = getTodaysClass[0].class_title;
    var studentId = getTodaysClass[0].bookedBy.booked_by;
    var teacherId = getTodaysClass[0].created_by;
    const teaherObj = {
      title: "Session Started soon",
      body: `${teacherName} your ${className} session begins after 30 minutes.`,
      contents: `${teacherName} your ${className} session begins after 30 minutes.`,
    };
    var teacherObjRes = await Helper.SendNotification(
      [teacherId],
      teaherObj,
      config.SESSIONREMINDERFORTEACHER
    );
    // need to get classIds from database

    for (let i = 0; i < getTodaysClass.length; i++) {
      var studentName = getTodaysClass[i].studentDetail.studentName;
      var teacherName = getTodaysClass[i].TeacherDetail.teacherName;
      var className = getTodaysClass[i].class_title;
      var studentId = getTodaysClass[i].bookedBy.booked_by;
      var teacherId = getTodaysClass[i].created_by;
      //for teacher
      const userObj = {
        title: "Session Started soon",
        body: `${studentName} your ${className} session begins after 30 minutes.`,
        contents: `${studentName} your ${className} session begins after 30 minutes.`,
      };
      var studentObjRes = await Helper.SendNotification(
        [studentId],
        userObj,
        config.SESSIONREMINDERFORSTUDENT
      );
      countRes.push(studentObjRes);
      if (getTodaysClass.length === countRes.length) {
        return console.log(countRes);
      }
    }
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const { title, body, contents } = req.body;

    const notificationObject = {
      title: title,
      body: body,
      contents: contents,
    };

    console.log(notificationObject);
    const result = await Helper.SendNotification([], notificationObject);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phone
 *         - password
 *         - confirm_password
 *         - user_role
 *         - accept_terms_and_conditions
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         phone:
 *           type: number
 *           description: contact number to register a user
 *         user_role:
 *           type: number
 *           description: 1 for student and 2 for teacher
 *         accept_terms_and_conditions:
 *           type: boolean
 *           description: 0 for not accept and 1 for accept
 *         deleted:
 *           type: number
 *           description: 0 for active account and 1 for deleted account
 *         account_verified:
 *           type: number
 *           description: 0 for otp verification is not done yet and 1 for verified account after otp verification
 *         otp:
 *           type: number
 *           description: otp number that need verification
 *         otp_expired:
 *           type: date
 *           description: otp number expiration time that need verification
 *         account_status:
 *           type: number
 *           description: account 0 => Need verification, status is 1 => Active, 2 => Suspended , 3 => Deleted.
 *         first_name:
 *           type: string
 *           description: User first name
 *         last_name:
 *           type: string
 *           description: user last name
 *         gender:
 *           type: number
 *           description: number of gender option coming from dropdown options
 *         dob:
 *           type: string
 *           description: date of birth of user
 *         age:
 *           type: number
 *           description: age of user
 *         street_address:
 *           type: string
 *           description: street address of user
 *         city:
 *           type: string
 *           description: city of user
 *         state:
 *           type: string
 *           description: state of user
 *         zip_code:
 *           type: string
 *           description: zip code of user
 *         topics:
 *           type: [number]
 *           description: topics for student profile
 *         expertise:
 *           type: string
 *           description: expertise of user (teacher)
 *         about_expertise:
 *           type: string
 *           description: Describe expertise for teacher profile
 *         language:
 *           type: string
 *           description: language for teacher
 *         intro_video:
 *           type: string
 *           description: intro video of teacher
 *         profile_image:
 *           type: string
 *           description: profile image url coming from s3 bucket
 *         planned_topics:
 *           type: [string]
 *           description: planned topics (teacher)
 *         profile_created:
 *           type: boolean
 *           description: true if account created with two steps complete and false if any step is pending
 *         created_at:
 *           type: date
 *           description: Date of creation of user account
 *         updated_at:
 *           type: date
 *           description: Date of updation of user account
 */
/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a account
 *     tags: [Signup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP send successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */

router.post(
  "/signup",
  [
    check("phone", "Please enter valid phone number").matches(
      /^(?=.*[0-9])(?=.{10,10})/
    ),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),
    check(
      "confirm_password",
      "Confirm password does not matched with password."
    ).isLength({ min: 8 }),
    check(
      "user_role",
      "User role is required (1 for student and 2 for teacher)"
    )
      .not()
      .isEmpty(),
    check("accept_terms_and_conditions", "Please accept terms and conditions")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      phone,
      password,
      confirm_password,
      user_role,
      accept_terms_and_conditions,
      fcmToken,
      deviceId,
      platform,
      ipAddress,
    } = req.body;

    try {
      let user = await User.findOne({
        phone: phone,
        account_verified: 1,
        deleted: 0,
      });
      if (user) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              response: "error",
              param: "phone",
              msg: "Phone number already exists.",
            },
          ],
        });
      }
      if (password != confirm_password) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              response: "error",
              param: "confirm_password",
              msg: "Confirm password does not matched with password.",
            },
          ],
        });
      }

      var deleted = 0;
      var account_status = 0; // account 0 => Need verification, status is 1 => Active, 2 => Suspended , 3 => Deleted.
      var created_at = new Date();
      var account_verified = 0;
      var phone_verification_code = Math.floor(100000 + Math.random() * 900000);
      var message =
        "Your OTP code is: " +
        phone_verification_code +
        ". The OTP code will expire after 5 minutes.";
      //send otp {{service messgebird}}
      await otpFunction(message, phone);
      // var otpSend = await client.messages.create({
      //   body: message,
      //   from: "+13182668073",
      //   to: `+91${phone}`,
      // });
      var otp_expired = new Date();
      otp_expired.setMinutes(otp_expired.getMinutes() + 5);
      console.log("msg", message);
      let otp = phone_verification_code;
      const salt = await bcrypt.genSalt(10);

      var userDetails = {};
      userDetails.phone = phone;
      userDetails.deleted = deleted;
      userDetails.password = await bcrypt.hash(password, salt);
      userDetails.user_role = user_role;
      userDetails.account_status = account_status;
      userDetails.created_at = created_at;
      userDetails.accept_terms_and_conditions = accept_terms_and_conditions;
      userDetails.account_verified = account_verified;
      userDetails.otp_expired = otp_expired;
      userDetails.otp = otp;

      //await user.save();
      user = await User.findOneAndUpdate(
        { phone: phone, deleted: 0 },
        { $set: userDetails },
        { new: true, upsert: true }
      );

      //manage the user Token
      var saveData = {
        fcm_token: fcmToken,
        device_id: deviceId,
        platform: platform,
        ip_address: ipAddress,
        user_id: user.id,
        updated_at: new Date(),
      };

      //check if device id is same change the token else insert
      await UserToken.findOneAndUpdate(
        {
          user_id: user.id,
          device_id: deviceId,
          platform: platform,
        },
        {
          $set: saveData,
        },
        {
          upsert: true,
          new: true,
        }
      );

      res.json({
        success: true,
        message: "OTP send successfully",
        data: {
          id: user.id,
          profile: {
            phone: user.phone,
          },
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        success: false,
        errors: [
          {
            msg: "Number is not registered on twillio",
            param: "server",
            location: "body",
          },
        ],
      });
    }
  }
);

/**
 * @swagger
 * /users/verifyOtp:
 *   post:
 *     summary: Enter otp and verify user account
 *     tags: [Verify Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.post(
  "/verifyOtp",
  [
    check("phone", "Please enter valid number").isLength({ min: 10, max: 10 }),
    check("otp", "OTP must be of 6 digit numbers").matches(/^[0-9]{6}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone, otp } = req.body;

    try {
      function diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.round(diff);
      }
      var userData = await User.findOne(
        { phone: phone, deleted: 0 },
        { otp_expired: 1, otp: 1, user_role: 1, profile_created: 1 }
      );
      console.log(userData);
      if (userData) {
        let otp_expired = userData.otp_expired;

        let currentDateTime = new Date();
        let expiredDateTime = new Date(otp_expired);
        var expiringDifference = diff_minutes(currentDateTime, expiredDateTime);
        //console.log(expiringDifference);
        if (otp == userData.otp) {
          if (expiringDifference < 0) {
            var userDetails = {};
            userDetails.otp = null;
            userDetails.account_verified = 1;
            userDetails.account_status = 1;
            await User.findOneAndUpdate(
              { phone: phone },
              { $set: userDetails }
            );
            const payload = {
              user: {
                id: userData.id,
              },
            };
            var user_id = userData.id;
            jwt.sign(
              payload,
              config.get("jwtSecret"),
              { expiresIn: 2592000 },
              (err, token) => {
                if (err) throw err;

                res.json({
                  success: true,
                  message: "OTP verified successfully",
                  data: {
                    id: user_id,
                    token: token,
                    user_role: userData.user_role,
                    profile_created: userData.profile_created,
                  },
                });
              }
            );
          } else {
            res.status(400).send({
              success: false,
              errors: [
                {
                  msg: "OTP get expired",
                  param: "otp",
                  location: "body",
                },
              ],
            });
          }
        } else if (otp != userData.otp) {
          res.status(400).send({
            success: false,
            errors: [
              {
                msg: "OTP is not valid",
                param: "otp",
                location: "body",
              },
            ],
          });
        }
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found with this phone",
              param: "phone",
              location: "body",
            },
          ],
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
  }
);

/**
 * @swagger
 * /users/resendOtp:
 *   post:
 *     summary: Resend otp if pervious get expired
 *     tags: [Verify Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP send successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.post(
  "/resendOtp",
  [check("phone", "Please enter valid phone number").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { phone } = req.body;

    try {
      var phone_verification_code = Math.floor(100000 + Math.random() * 900000);
      var phoneno = /^\d{10}$/;
      if (phone.match(phoneno)) {
        let user = await User.findOne({ phone: phone, deleted: 0 });
        // console.log("phone number working" , phone)
        if (user && user.account_verified == 0) {
          show_mobile_verification_screen = true;

          var message =
            "Your OTP code is: " +
            phone_verification_code +
            ". The OTP code will expire after 5 minutes.";
          //send otp {{service messgebird}}
          await otpFunction(message, phone);

          var userDetails = {};
          var otp_expired_time = new Date();
          otp_expired_time = otp_expired_time.setMinutes(
            otp_expired_time.getMinutes() + 5
          );
          userDetails.otp_expired = otp_expired_time;
          userDetails.otp = phone_verification_code;

          console.log("msg", message);
          await User.findOneAndUpdate(
            { phone: phone, deleted: 0 },
            { $set: userDetails },
            { new: true, upsert: true }
          );
          res.json({
            success: true,
            message: "OTP send successfully",
            data: {
              profile: {
                phone: user.phone,
              },
            },
          });
        } else if (user && user.account_verified == 1) {
          return res.status(400).json({
            success: false,
            errors: [
              {
                response: "error",
                param: "phone",
                msg: "Phone number already exists.",
              },
            ],
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          errors: [
            {
              response: "error",
              param: "phone",
              msg: "Phone is not valid",
            },
          ],
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
  }
);

/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     summary: Forgot password API just pass phone in it and get reset password otp
 *     tags: [Forgot password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP send successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.post(
  "/forgotPassword",
  [
    check("phone", "Please enter valid phone number").matches(
      /^(?=.*[0-9])(?=.{10,10})/
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { phone } = req.body;
    try {
      let user = await User.findOne({ phone: phone, deleted: 0 });
      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              status: 0,
              response: "error",
              param: "email",
              msg: "Please use registered phone",
            },
          ],
        });
      } else {
        var phone_verification_code = Math.floor(
          100000 + Math.random() * 900000
        );
        var message =
          "Your OTP code is: " +
          phone_verification_code +
          ". The OTP code will expire after 5 minutes.";

        //send otp {{service messgebird}}
        await otpFunction(message, phone);

        // var otpSend = await client.messages.create({
        //   body: message,
        //   from: "+13182668073",
        //   to: `+91${phone}`,
        // });

        var otp_expired = new Date();
        otp_expired.setMinutes(otp_expired.getMinutes() + 5);
        otp_expired = otp_expired;
        // console.log("msg", message);
        var userDetails = {};
        let otp = phone_verification_code;
        userDetails.phone = phone;
        userDetails.otp = otp;
        userDetails.otp_expired = otp_expired;
        await User.findOneAndUpdate(
          { phone: phone, deleted: 0 },
          { $set: userDetails }
        );
        //await user.save();
        return res.json({
          success: true,
          message: "OTP send successfully",
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
  }
);

/**
 * @swagger
 * /users/verifyOtpAfterForgotPassword:
 *   post:
 *     summary: Verification of otp in forgot password process
 *     tags: [Forgot password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.post(
  "/verifyOtpAfterForgotPassword",
  [
    check("phone", "Please enter valid number").isLength({ min: 10, max: 10 }),
    check("otp", "OTP must be of 6 digit numbers").matches(/^[0-9]{6}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone, otp } = req.body;

    try {
      function diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.round(diff);
      }
      var userData = await User.findOne(
        { phone: phone, deleted: 0 },
        { otp_expired: 1, otp: 1 }
      );
      console.log(userData);
      if (userData) {
        let otp_expired = userData.otp_expired;

        let currentDateTime = new Date();
        let expiredDateTime = new Date(otp_expired);
        var expiringDifference = diff_minutes(currentDateTime, expiredDateTime);
        //console.log(expiringDifference);
        if (otp == userData.otp) {
          if (expiringDifference < 0) {
            var userDetails = {};
            userDetails.otp_expired = new Date();
            userDetails.otp = null;
            userDetails.account_verified = 1;
            userDetails.account_status = 1;
            await User.findOneAndUpdate(
              { phone: phone },
              { $set: userDetails }
            );

            var user_id = userData.id;

            res.json({
              success: true,
              message: "OTP verified successfully",
              data: {
                id: user_id,
              },
            });
          } else {
            res.status(400).send({
              success: false,
              errors: [
                {
                  msg: "OTP get expired",
                  param: "otp",
                  location: "body",
                },
              ],
            });
          }
        } else if (otp != userData.otp) {
          res.status(400).send({
            success: false,
            errors: [
              {
                msg: "OTP is not valid",
                param: "otp",
                location: "body",
              },
            ],
          });
        }
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found with this phone",
              param: "phone",
              location: "body",
            },
          ],
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
  }
);

/**
 * @swagger
 * /users/createPassword/{id}:
 *   put:
 *     summary: Verification of otp in forgot password process
 *     tags: [Forgot password]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: Id of user how follow the process of forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Password is updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.put(
  "/createPassword/:id",
  [
    [
      check(
        "new_password",
        "Please enter a new password with 8 or more characters"
      ).isLength({ min: 8 }),
      check(
        "confirm_password",
        "Confirm password does not matched with password."
      ).isLength({ min: 8 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    var err = [];
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            response: "error",
            param: "confirm_password",
            msg: "Confirm password does not matched with new password",
          },
        ],
      });
    }

    // Build passwordObject
    const salt = await bcrypt.genSalt(10);

    const passwordObject = {};
    if (new_password)
      passwordObject.password = await bcrypt.hash(new_password, salt);
    passwordObject.updated_at = new Date();

    try {
      // Using upsert option (creates new doc if no match is found):
      let personalData = await User.findOneAndUpdate(
        { _id: req.params.id, deleted: 0 },
        { $set: passwordObject }
      );
      res.json({
        success: true,
        response: "successful",
        message: "Password is updated successfully",
      });
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
  }
);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Signin (Authenticate user & get token)
 *     tags: [Sign in - Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.post(
  "/signin",
  [
    check("phone", "Please enter valid number").isLength({ min: 10, max: 10 }),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    // platform : "web" , "android" , "iOS"
    const { phone, password, fcmToken, deviceId, platform, ipAddress } =
      req.body;

    try {
      var user = await User.findOne({
        phone: phone,
        account_verified: 1,
        account_status: 1,
        deleted: 0,
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              response: "error",
              param: "phone",
              msg: "Please use registered phone",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              status: 0,
              response: "error",
              param: "password",
              msg: "Please use correct password",
            },
          ],
        });
      }
      if (user.account_status == 2) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              status: 0,
              response: "error",
              param: "password",
              msg: "Account suspended by the platform admin.",
            },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      //manage the user Token
      var saveData = {
        fcm_token: fcmToken,
        device_id: deviceId,
        platform: platform,
        ip_address: ipAddress,
        user_id: user.id,
        updated_at: new Date(),
      };

      //check if device id is same change the token else insert
      await UserToken.findOneAndUpdate(
        {
          user_id: user.id,
          device_id: deviceId,
          platform: platform,
        },
        {
          $set: saveData,
        },
        {
          upsert: true,
          new: true,
        }
      );

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            message: "Login success",
            data: {
              token: token,
              user_role: user.user_role,
              profile_created: user.profile_created,
              profile: user,
            },
          });
        }
      );
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
  }
);

/**
 * @swagger
 * /users/updateBasicProfileInfo:
 *   put:
 *     summary: Update profile basic info
 *     tags: [Update basic info of student and teacher]
 *     parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *          required: true
 *          description: authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.put(
  "/updateBasicProfileInfo",
  auth,
  [
    check("first_name", "Firstname is required").not().isEmpty(),
    check("gender_identity", "Please select gender").matches(/^[0-9]+$/),
    check("dob", "Date of birth is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {
      first_name,
      last_name,
      gender_identity,
      dob,
      street_address,
      city,
      state,
      zip_code,
      age,
      language,
      profile_image,
    } = req.body;

    try {
      var userData = await User.findOne(
        {
          _id: req.user.id,
          deleted: 0,
          account_status: 1,
          account_verified: 1,
        },
        { _id: 1 }
      );
      if (userData) {
        var userDetails = {};
        var message = "";
        userDetails.first_name = first_name;
        userDetails.last_name = last_name;
        userDetails.gender = gender_identity;
        userDetails.dob = dob;
        userDetails.age = age;
        userDetails.street_address = street_address;
        userDetails.city = city;
        userDetails.state = state;
        userDetails.zip_code = zip_code;
        userDetails.profile_created = true;
        userDetails.language = language;
        if (profile_image) {
          userDetails.profile_image = profile_image;
        }
        userDetails.updated_at = new Date();

        message = "Profile updated successfully.";

        await User.findOneAndUpdate(
          {
            _id: req.user.id,
            deleted: 0,
            account_status: 1,
            account_verified: 1,
          },
          { $set: userDetails }
        );
        userData = await User.findOne({ _id: req.user.id, deleted: 0 }).select(
          "-password"
        );
        console.log(userData);

        res.json({
          success: true,
          message: message,
          data: {
            id: userData.id,
            user_role: userData.user_role,
            profile_created: userData.profile_created,
            profile: userData,
          },
        });
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found",
              param: "token",
              location: "body",
            },
          ],
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
  }
);

/**
 * @swagger
 * /users/updateBasicProfileInfoStep2:
 *   put:
 *     summary: Update profile basic info step 2
 *     tags: [Update basic info of student and teacher]
 *     parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *          required: true
 *          description: authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: validations error or un-authorized parameters
 *       500:
 *         description: Some server error
 */
router.put("/updateBasicProfileInfoStep2", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const {
    topics,
    expertise,
    about_expertise,
    planned_topics,
    tags,
    profile_image,
    intro_video,
  } = req.body;

  try {
    var userData = await User.findOne(
      { _id: req.user.id, deleted: 0, account_status: 1, account_verified: 1 },
      { _id: 1 }
    );

    if (userData) {
      var userDetails = {};
      var message = "";
      userDetails.topics = topics;
      userDetails.expertise = expertise;
      userDetails.about_expertise = about_expertise;
      userDetails.planned_topics = planned_topics;
      userDetails.profile_image = profile_image;
      userDetails.intro_video = intro_video;

      userDetails.updated_at = new Date();

      message = "Profile updated successfully.";

      await User.findOneAndUpdate(
        {
          _id: req.user.id,
          deleted: 0,
          account_status: 1,
          account_verified: 1,
        },
        { $set: userDetails }
      );
      userData = await User.findOne({ _id: req.user.id, deleted: 0 }).select(
        "-password"
      );
      console.log(userData);
      if (tags && tags.length > 0) {
        try {
          await Tags.insertMany(tags, { ordered: false });
        } catch (e) {
          console.log("Has some duplicate entries");
        }
      }
      res.json({
        success: true,
        message: message,
        data: {
          id: userData.id,
          profile: userData,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

/**
 * @swagger
 * /users/addDropdown:
 *   post:
 *     summary: Create a dropdown item
 *     tags: [Dropdown]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dropdown'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dropdown'
 *       500:
 *         description: Some server error
 */

router.post(
  "/addDropdown",
  [
    check("name", "Please enter valid name").not().isEmpty(),
    check("options", "Please enter valid options").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, options } = req.body;

    try {
      var dropdownObject = {};
      if (options.length > 0) {
        dropdownObject.options = options;
      } else {
        dropdownObject.options = [];
      }
      dropdownObject.name = name;

      await Dropdown.findOneAndUpdate(
        { name: name },
        { $set: dropdownObject },
        { new: true, upsert: true }
      );
      //await user.save();

      res.json({
        success: true,
        message: "Record updated successfully",
      });
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
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Dropdown:
 *       type: object
 *       required:
 *         - name
 *         - options
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the dropdown
 *         name:
 *           type: string
 *           description: Name of dropdown input field
 *         options:
 *           type: [string]
 *           description: Array of all dropdown options
 *         created_at:
 *           type: date
 *           description: Date of creation of dropdown input
 *         updated_at:
 *           type: date
 *           description: Date of updation of dropdown input
 *       example:
 *         name: gender
 *         options: ['Male','Female','Others']
 */

/**
 * @swagger
 * tags:
 *   name: Dropdown
 *   description: Get all dropdown values for app
 */

/**
 * @swagger
 * /users/getDropdown:
 *   get:
 *     summary: Returns the list of all the dropdown items
 *     tags: [Dropdown]
 *     responses:
 *       200:
 *         description: The list of the Dropdown
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dropdown'
 */
router.get("/getDropdown", async (req, res) => {
  try {
    var dropdownData = await Dropdown.find();
    //await user.save();
    if (dropdownData.length == 0) {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "dropdown data",
            location: "body",
          },
        ],
      });
    }

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: dropdownData,
    });
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

// @route    POST api/users/addCategory
// @desc     add category name
// @access   Private
router.post(
  "/addCategory",
  [
    check("category_name", "Please enter valid name").not().isEmpty(),
    check(
      "category_status",
      "Please enter valid category status (true => to publish category and false => unpublish category"
    )
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { category_name, category_status } = req.body;

    try {
      var categoryObject = {};
      categoryObject.category_name = category_name;
      categoryObject.category_status = category_status;

      await Categories.findOneAndUpdate(
        { category_name: category_name },
        { $set: categoryObject },
        { new: true, upsert: true }
      );
      //await user.save();

      res.json({
        success: true,
        message: "Record updated successfully",
      });
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
  }
);

// @route    POST api/users/getCategories
// @desc     view categories list
// @access   Public
router.get("/getCategories", async (req, res) => {
  try {
    var categoriesData = await Categories.find();
    //await user.save();
    if (categoriesData.length == 0) {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "categories data",
            location: "body",
          },
        ],
      });
    }

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: categoriesData,
    });
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

// @route    POST api/users/getTags
// @desc     view tags list
// @access   Public
router.get("/getTags", async (req, res) => {
  try {
    var tagsData = await Tags.find({ tag_status: true });
    //await user.save();
    if (tagsData.length == 0) {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "tags data",
            location: "body",
          },
        ],
      });
    }

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: tagsData,
    });
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

// @route    POST api/users/getTags
// @desc     view tags list
// @access   Public
router.delete("/deleteAccount/:id", async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "User deleted" });
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

//@route  GET v1/users/getUrl
//@desc   Get security url from aws
//@access public
router.get("/getUrl", async (req, res) => {
  try {
    function createImageName(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    const imageName = createImageName(10);

    const params = {
      Bucket: bucketName,
      Key: imageName,
      Expires: 60,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.json({
      success: true,
      message: "Data fetch successfully",
      data: uploadURL,
    });
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

// @route    POST api/users/createClass
// @desc     add class
// @access   Private
router.post(
  "/createClass",
  auth,
  [
    check("discipline", "Discipline field is required").not().isEmpty(),
    check("topics", "Topics are required").not().isEmpty(),
    check("class_title", "Class title is required").not().isEmpty(),
    check("class_subtitle", "Class subtitle is required").not().isEmpty(),
    check("class_description", "Class description is required").not().isEmpty(),
    check("class_level", "Class level is required").not().isEmpty(),
    check("language_of_class", "Language of class is required").not().isEmpty(),
    check("cover_image", "Cover image is required").not().isEmpty(),
    check("type_of_class", "Type of class is required").not().isEmpty(),
    check("session_type", "Session type is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      discipline,
      topics,
      topics_text,
      class_title,
      class_subtitle,
      class_description,
      class_level,
      language_of_class,
      cover_image,
      type_of_class,
      session_type,
      session_duration,
      price,
      max_students_allowed,
      class_detail,
      address_or_class_link,
      longitude,
      latitude,
      class_created_from,
    } = req.body;

    try {
      const commissionAmount = await Commission.findOne();
      if (type_of_class == 2 || type_of_class == 3) {
        if (!class_detail || class_detail.length == 0) {
          return res.status(400).send({
            success: false,
            errors: [
              {
                msg: "Class detail is missing",
                param: "class_detail",
                location: "body",
              },
            ],
          });
        }
        var currentDate = new Date();
        var month = currentDate.getMonth() + 1;
        var formattedCurrentDate = `${currentDate.getFullYear()}-${(
          "0" + month
        ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}T00:00:00.000Z`;

        var getAllUpcomingClasses = await classDetailsSchema.find(
          {
            class_session_date: {
              $gte: formattedCurrentDate,
            },
            created_by: req.user.id,
            deleted : 0
          },
          {
            class_date: 1,
            end_time_of_class: 1,
            start_time_of_class: 1,
          }
        );
        function getMinutes(str) {
          var time = str.split(":");
          return time[0] * 60 + time[1] * 1;
        }
        const tConvert = (time24) => {
          const [sHours, minutes] = time24
            .match(/([0-9]{1,2}):([0-9]{1,2})/)
            .slice(1);
          const period = +sHours < 12 ? "AM" : "PM";
          const hours = +sHours % 12 || 12;
          return `${hours}:${minutes} ${period}`;
        };
        const messageAsPerDateAndTime = (
          start_time_of_class,
          end_time_of_class,
          class_date
        ) => {
          return `Session is already added with time slot of ${tConvert(
            start_time_of_class
          )} - ${tConvert(end_time_of_class)} on ${class_date}`;
        };
        var errorsArray = [];
        for (var i = 0; i < getAllUpcomingClasses.length; i++) {
          for (
            var comingClasses = 0;
            comingClasses < class_detail.length;
            comingClasses++
          ) {
            var dateEnterByUser = new Date(
              class_detail[comingClasses].class_date
            );
            var dateAvailableInRecords = new Date(
              getAllUpcomingClasses[i].class_date
            );
            if (
              dateEnterByUser.getTime() === dateAvailableInRecords.getTime()
            ) {
              var endTimeEnterByUser = getMinutes(
                class_detail[comingClasses].class_end_time
              );
              var endTimeInRecords = getMinutes(
                getAllUpcomingClasses[i].end_time_of_class
              );
              var startEnterByUser = getMinutes(
                class_detail[comingClasses].class_start_time
              );
              var startTimeInRecords = getMinutes(
                getAllUpcomingClasses[i].start_time_of_class
              );
              if (
                (startTimeInRecords < startEnterByUser &&
                  startEnterByUser < endTimeInRecords) ||
                (startTimeInRecords < endTimeEnterByUser &&
                  endTimeEnterByUser < endTimeInRecords) ||
                (startEnterByUser < startTimeInRecords &&
                  startTimeInRecords < endTimeEnterByUser) ||
                (startEnterByUser < endTimeInRecords &&
                  endTimeInRecords < endTimeEnterByUser) ||
                (startEnterByUser == startTimeInRecords &&
                  endTimeInRecords == endTimeEnterByUser)
              ) {
                errorsArray.push({
                  msg: messageAsPerDateAndTime(
                    getAllUpcomingClasses[i].start_time_of_class,
                    getAllUpcomingClasses[i].end_time_of_class,
                    getAllUpcomingClasses[i].class_date
                  ),
                });
              }
            }
          }
        }
        if (errorsArray.length > 0) {
          return res.status(400).send({
            success: false,
            errors: errorsArray,
          });
        }
      }
      var created_by = req.user.id;
      var classObject = {};
      classObject.discipline = discipline;
      classObject.class_created_from = class_created_from;
      classObject.created_by = created_by;
      classObject.topics = topics;
      classObject.topics_text = topics_text;
      classObject.class_title = class_title;
      classObject.class_subtitle = class_subtitle;
      classObject.class_description = class_description;
      classObject.class_level = class_level; //1 => "Beginner", 2 => "Intermediate", 3 => "Advanced"
      classObject.language_of_class = language_of_class;
      classObject.cover_image = cover_image;
      classObject.type_of_class = type_of_class; // 1 => on demand, 2 => single class, 3 => course
      classObject.price = price;
      classObject.session_type = session_type; // 1 => local , 2 => online
      classObject.enrolled_students = 0;
      classObject.class_status = 1;
      if (session_type == 1) {
        if (latitude && longitude) {
          classObject.location = {
            type: "Point",
            coordinates: [longitude, latitude],
          };
        }
      }
      if (type_of_class == 1) {
        classObject.session_duration = session_duration;
        classObject.max_students_allowed = 1;
      }
      if (type_of_class == 2 || type_of_class == 3) {
        classObject.address_or_class_link = address_or_class_link;
        classObject.max_students_allowed = max_students_allowed;
      }
      classObject.platform_fee_percentage = commissionAmount.payout_commission;
      classObject.created_at = new Date();

      const newClass = new Classes(classObject);

      const createdClass = await newClass.save();
      //await user.save();
      if (type_of_class == 2 || type_of_class == 3) {
        console.log("body", req.body);
        console.log(class_detail);
        if (!class_detail || class_detail.length == 0) {
          return res.status(400).send({
            success: false,
            errors: [
              {
                msg: "Class detail is missing",
                param: "class_detail",
                location: "body",
              },
            ],
          });
        }
        var payout_start_date = new Date();
        var classDetailsObject = class_detail.map(function (detail) {
          payout_start_date = new Date(detail.class_date);
          var dayData = new Date(detail.class_date).getDate();
          var monthData =
            Number(new Date(detail.class_date).getMonth()) + Number(1);
          var yearData = new Date(detail.class_date).getFullYear();
          var fullDate = yearData + "-" + monthData + "-" + dayData;
          return {
            class_title: class_title,
            day_of_class: dayData,
            month_of_class: monthData,
            year_of_class: yearData,
            class_date: detail.class_date,
            class_session_date: new Date(fullDate),
            start_time_of_class: detail.class_start_time,
            end_time_of_class: detail.class_end_time,
            class_id: createdClass._id,
            deleted : 0,
            created_by: created_by,
            created_at: new Date(),
          };
        });
        if (classDetailsObject.length > 0) {
          var allSessions = await classDetailsSchema.insertMany(
            classDetailsObject
          );
          var allSessionsIds = allSessions.map(function (sessiondetail) {
            return sessiondetail._id;
          });
          var newPayout = new Payouts({
            platform_fee_percentage: commissionAmount.payout_commission,
            class_id: createdClass._id,
            session_ids: allSessionsIds,
            class_created_by: created_by,
            payout_start_date: payout_start_date,
            created_at: new Date(),
            is_payout_detail_exists: false,
            deleted: 0,
          });
          await newPayout.save();
        }
      }
      return res.json({
        success: true,
        message: "Class created successfully",
        data: createdClass,
      });
    } catch (err) {
      console.error(err.message);

      return res.status(500).send({
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
  }
);

// @route    GET api/users/getPayoutsList
// @desc     get teacher public profile info
// @access   Private
router.get("/getPayoutsList", auth, async (req, res) => {
  try {
    const { page, start_date, end_date, payout_status, time_selected } =
      req.query;
    var pageNo = 1;
    if (page) {
      pageNo = page;
    }
    var limit = 10;
    var skip = (pageNo - 1) * limit;
    var searchQueryOfDates = {
      class_created_by: ObjectId(req.user.id),
      deleted: 0,
      earning: {
        $gt: 0,
      },
    };
    if (payout_status && payout_status == 0) {
      searchQueryOfDates["$or"] = [
        { is_payout_detail_exists: false },
        { "payout_details.payout_status": 0 },
      ];
    } else if (payout_status == 1 || payout_status == 2) {
      searchQueryOfDates["payout_details.payout_status"] =
        parseInt(payout_status);
    }
    // time_selected == 0 : All dates
    // time_selected == 1 :  This Year,
    // time_selected == 2 : This Month
    // time_selected == 3 : Selected Dates
    if (time_selected == 1) {
      var currentYear = new Date().getFullYear();
      var completeDate = new Date(currentYear + "-01-01");
      searchQueryOfDates["created_at"] = {
        $gte: completeDate,
      };
    } else if (time_selected == 2) {
      var currentYear = new Date().getFullYear();
      var month = new Date().getMonth() + 1;
      var completeDate = new Date(currentYear + "-" + month + "-01");
      searchQueryOfDates["created_at"] = {
        $gte: completeDate,
      };
    } else if (time_selected == 3 && start_date && end_date) {
      searchQueryOfDates["created_at"] = {
        $gte: start_date,
        $lte: end_date,
      };
    }
    var totalPayoutRecords = await Payouts.aggregate([
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      {
        $match: searchQueryOfDates,
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    var payoutRecords = await Payouts.aggregate([
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                class_title: { $ifNull: ["$class_title", ""] },
              },
            },
          ],
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      {
        $match: searchQueryOfDates,
      },
      { $sort: { created_at: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          items: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        records: payoutRecords,
        totalRecords: totalPayoutRecords.length,
      },
    });
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

// @route    GET api/users/getPayoutsDetail/:payoutId
// @desc     get teacher public profile info
// @access   Private
router.get("/getPayoutsDetail/:payoutId", auth, async (req, res) => {
  try {
    var payout_id = req.params.payoutId;
    var payoutDetail = await PayoutsDetails.findOne({
      payout_id: payout_id,
    })
      .populate({
        path: "payout_id",
        populate: {
          path: "class_booked_by",
          select: {
            first_name: { $ifNull: ["$first_name", ""] },
            last_name: { $ifNull: ["$last_name", ""] },
            profile_image: { $ifNull: ["$profile_image", ""] },
          },
        },
      })
      .populate({
        path: "payout_id",
        populate: {
          path: "class_id",
          select: {
            class_title: { $ifNull: ["$class_title", ""] },
            session_type: 1,
            price: 1,
          },
        },
      });
    var getClassRecord = await Payouts.findOne({
      _id: payout_id,
    })
      .populate("class_id")
      .populate({
        path: "class_booked_by",
        select: {
          first_name: { $ifNull: ["$first_name", ""] },
          last_name: { $ifNull: ["$last_name", ""] },
          profile_image: { $ifNull: ["$profile_image", ""] },
        },
      });
    var payout_status = 0;
    var payout_date = "";
    var payout_amount = 0;
    var classes_completion_date = "";
    var class_title = "";
    var session_type = 1;
    var class_charges = 0;
    var booked_by = [];
    var platform_commission = 0;
    var processed_amount = 0;
    var class_id = "";
    var payout_feedback = "";
    if (getClassRecord) {
      class_title = getClassRecord?.class_id?.class_title;
      class_id = getClassRecord?.class_id?._id;
      classes_completion_date = getClassRecord?.payout_start_date;
      session_type = getClassRecord?.class_id?.session_type;
      booked_by = getClassRecord?.class_booked_by;
      class_charges = getClassRecord?.class_id?.price;
      platform_commission = getClassRecord?.platform_fee;
    }
    if (payoutDetail) {
      payout_status = payoutDetail?.payout_status;
      payout_feedback = payoutDetail?.payout_feedback;
      payout_date = payoutDetail?.created_at;
      payout_amount = payoutDetail?.payout_id?.earning;
      classes_completion_date = payoutDetail?.payout_id?.payout_start_date;
      class_title = payoutDetail?.payout_id?.class_id?.class_title;
      class_id = payoutDetail?.payout_id?.class_id?._id;
      session_type = payoutDetail?.payout_id?.class_id?.session_type;
      booked_by = payoutDetail?.payout_id?.class_booked_by;
      class_charges = payoutDetail?.payout_id?.class_id?.price;
      platform_commission = payoutDetail?.payout_id?.platform_fee;
      processed_amount = payoutDetail?.paid_amount;
    }
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        payout_status,
        payout_date,
        payout_amount,
        classes_completion_date,
        class_id,
        class_title,
        booked_by,
        session_type,
        class_charges,
        platform_commission,
        processed_amount,
        payout_feedback,
      },
    });
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

router.get("/totalEarning", auth, async (req, res) => {
  try {
    var cardDetailsExists = false;
    const saveCardDetails = await AccountDetail.findOne(
      {
        teacher_id: req.user.id,
      },
      { _id: 1 }
    );
    if (saveCardDetails) {
      cardDetailsExists = true;
    }
    var payoutsDetail = await Payouts.aggregate([
      {
        $match: {
          is_payout_detail_exists: true,
          class_created_by: ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          pipeline: [
            {
              $match: {
                payout_status: 1,
              },
            },
            {
              $project: {
                paid_amount: 1,
              },
            },
          ],
          as: "payout_details",
        },
      },
      {
        $unwind: "$payout_details",
      },
      {
        $group: {
          _id: "class_created_by",
          items: {
            $push: "$payout_details.paid_amount",
          },
        },
      },
      {
        $project: {
          paid_amount: { $sum: "$items" },
        },
      },
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        payoutsDetail,
        cardDetailsExists: cardDetailsExists,
      },
    });
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

router.get("/totalEarningFromRefund", auth, async (req, res) => {
  try {
    var cardDetailsExists = false;
    const saveCardDetails = await AccountDetail.findOne(
      {
        teacher_id: req.user.id,
      },
      { _id: 1 }
    );
    if (saveCardDetails) {
      cardDetailsExists = true;
    }
    var refundDetail = await RefundRequests.aggregate([
      {
        $match: {
          class_booked_by: ObjectId(req.user.id),
          refund_status: 1,
        },
      },
      {
        $group: {
          _id: "$class_booked_by",
          items: {
            $push: "$refund_amount",
          },
        },
      },
      {
        $project: {
          refund_amount: { $sum: "$items" },
        },
      },
    ]);
    if (refundDetail.length == 0) {
      refundDetail.push({
        _id: "class_booked_by",
        refund_amount: 0,
      });
    }
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        refundDetail,
        cardDetailsExists: cardDetailsExists,
      },
    });
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

router.post(
  "/applyForRefund",
  auth,
  [
    check("transaction_id", "Transaction id is required").not().isEmpty(),
    check("reason_to_apply_refund", "Please provide a reason of refund")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    try {
      const { transaction_id, reason_to_apply_refund } = req.body;
      var transactionRecord = await Transaction.findOne(
        { _id: transaction_id },
        { invoice_data: 0 }
      );

      if (!transactionRecord) {
        return res.json({
          success: false,
          errors: [
            {
              msg: "Invalid transaction id.",
            },
          ],
        });
      } else {
        var checkRequestExistsOfNot = await RefundRequests.findOne({
          transaction_id: transaction_id,
        });
        if (checkRequestExistsOfNot) {
          return res.json({
            success: false,
            errors: [
              {
                msg: "Refund request already applied.",
              },
            ],
          });
        }
        var getSessionsOfSelectedTransactionId = await BookedClasses.aggregate([
          {
            $match: {
              transaction_id: ObjectId(transaction_id),
            },
          },
          {
            $group: {
              _id: transaction_id,
              items: {
                $push: "$session_id",
              },
            },
          },
        ]);

        var refundObject = {};
        refundObject.transaction_id = transaction_id;
        refundObject.class_booked_by = req.user.id;
        refundObject.class_id = transactionRecord.class_id;
        refundObject.session_ids = getSessionsOfSelectedTransactionId[0].items;
        refundObject.class_created_by = transactionRecord.created_by;
        refundObject.refund_status = 0;
        refundObject.reason_to_apply_refund = reason_to_apply_refund;
        refundObject.created_at = new Date();
        refundObject.deleted = 0;
        // return res.json({
        //   refundObject,
        // });
        var newRequest = new RefundRequests(refundObject);
        await newRequest.save();
        res.json({
          success: true,
          message: "Request applied successfully.",
          data: newRequest,
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
  }
);

router.get(
  "/checkRefundRequestAppliedOrNot/:transaction_id",
  auth,
  async (req, res) => {
    try {
      const { transaction_id } = req.params;
      var transactionRecord = await Transaction.findOne(
        { _id: transaction_id },
        { invoice_data: 0 }
      );

      if (!transactionRecord) {
        return res.json({
          success: false,
          errors: [
            {
              msg: "Invalid transaction id.",
            },
          ],
        });
      }
      var checkRequestExistsOfNot = await RefundRequests.findOne({
        transaction_id: transaction_id,
      });
      if (checkRequestExistsOfNot) {
        return res.json({
          success: false,
          errors: [
            {
              msg: "Refund request already applied.",
            },
          ],
        });
      } else {
        return res.json({
          success: true,
          msg: "No barrier found you can apply for refund",
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
  }
);

router.get("/getRefundRequestList", auth, async (req, res) => {
  try {
    const { page } = req.query;
    var pageNo = 1;
    if (page) {
      pageNo = page;
    }
    var limit = 10;
    var skip = (pageNo - 1) * limit;
    var totalRecords = await RefundRequests.find(
      {
        class_booked_by: req.user.id,
      },
      { _id: 1 }
    );
    var checkRequestExistsOfNot = await RefundRequests.aggregate([
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                class_title: { $ifNull: ["$class_title", ""] },
              },
            },
          ],
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $match: {
          class_booked_by: ObjectId(req.user.id),
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          items: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    return res.json({
      success: true,
      msg: "Record fetched successfully",
      data: {
        records: checkRequestExistsOfNot,
        totalRecords: totalRecords.length,
      },
    });
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

// @route    GET api/users/getTeacherPublicProfile
// @desc     get teacher public profile info
// @access   Private
router.get("/getTeacherPublicProfile", auth, async (req, res) => {
  try {
    var userData = await User.findOne({
      _id: req.user.id,
      deleted: 0,
      account_status: 1,
      account_verified: 1,
    });
    var genderData = await Dropdown.findOne({ name: "gender_identity" });
    if (userData) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: {
          user_name: userData.first_name + " " + userData.last_name,
          expertise: userData.expertise,
          street_address: userData.street_address,
          city: userData.city,
          state: userData.state,
          zip_code: userData.zip_code,
          age: userData.age,
          gender: genderData ? genderData.options[userData.gender] : "",
          language: userData.language,
          about_me: userData.about_expertise,
          planned_topics: userData.planned_topics,
          profile_image: userData.profile_image,
          gallery_video: userData.intro_video,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getStudentProfile
// @desc     get teacher public profile info
// @access   Private
router.get("/getStudentProfile", auth, async (req, res) => {
  try {
    var userData = await User.findOne(
      { _id: req.user.id, deleted: 0, account_status: 1, account_verified: 1 },
      { password: 0 }
    );
    if (userData) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: userData,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getStudentProfile
// @desc     get teacher public profile info
// @access   Private
router.get(
  "/getStudentProfileWithoutToken/:student_id",
  auth,
  async (req, res) => {
    try {
      var userData = await User.findOne(
        {
          _id: req.params.student_id,
          deleted: 0,
          account_status: 1,
          account_verified: 1,
        },
        { password: 0 }
      );
      if (userData) {
        res.json({
          success: true,
          message: "Record fetched successfully.",
          data: userData,
        });
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found",
              param: "token",
              location: "body",
            },
          ],
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
  }
);

// @route    GET api/users/getClassesList
// @desc     get classes list of auth teacher
// @access   Private
router.get("/getClassesList", auth, async (req, res) => {
  try {
    var classData = await Classes.find(
      {
        created_by: req.user.id,
        $or: [{ class_status: 0 }, { class_status: 1 }],
      },
      {
        discipline: 1,
        class_title: 1,
        price: 1,
        max_students_allowed: 1,
      }
    ).sort({ created_at: -1 });
    if (classData.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: classData,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getClassDetail/:id
// @desc     get class detail of auth teacher using id
// @access   Private
router.get("/getClassDetail/:class_id", auth, async (req, res) => {
  try {
    var class_id = req.params.class_id;
    var created_by = req.user.id;
    if (!class_id) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "class_id parameter is missing",
            param: "params",
            location: "body",
          },
        ],
      });
    }
    var teacher = await User.findOne(
      {
        _id: created_by,
        account_status: 1,
      },
      {
        phone: 1,
        profile_image: 1,
        first_name: 1,
        last_name: 1,
      }
    );
    if (!teacher) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "Teacher account does not exists",
            param: "server",
            location: "body",
          },
        ],
      });
    } else {
      var classExists = await Classes.findOne(
        { _id: class_id, $or: [{ class_status: 0 }, { class_status: 1 }] },
        {
          topics: 0,
          class_detail: 0,
          created_by: 0,
          // session_type: 0,
          enrolled_students: 0,
        }
      );
      if (classExists) {
        // var getTheseTags = [];
        //   var selectedTagsCount = classExists.topics.length;
        //   for(var tag=0;tag<selectedTagsCount;tag++){
        //     getTheseTags.push(ObjectId(classExists.topics[tag]));
        //   }
        // var addedTag = await Tags.find({_id:{"$in": getTheseTags}},{tag_name:1});
        var sessionData = [];
        if (classExists.type_of_class == 2 || classExists.type_of_class == 3) {
          sessionData = await classDetailsSchema.find({ class_id: class_id, deleted : 0 });
          if (sessionData.length == 0) {
            return res.status(400).send({
              success: false,
              errors: [
                {
                  msg: "Session not found",
                  param: "server",
                  location: "body",
                },
              ],
            });
          }
        }
        return res.json({
          success: true,
          message: "Data fetched successfully.",
          data: {
            classData: classExists,
            sessionData: sessionData,
            teacherProfile: teacher,
            addedTag: classExists.topics_text,
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "Class not found",
              param: "server",
              location: "body",
            },
          ],
        });
      }
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

// @route    GET api/users/getClassDetailForEdit/:id
// @desc     get class detail of auth teacher using id
// @access   Private
router.get("/getClassDetailForEdit/:class_id", auth, async (req, res) => {
  try {
    var class_id = req.params.class_id;
    var created_by = req.user.id;
    if (!class_id) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "class_id parameter is missing",
            param: "params",
            location: "body",
          },
        ],
      });
    }
    var classExists = await Classes.findOne({
      _id: class_id,
      created_by: created_by,
      $or: [{ class_status: 0 }, { class_status: 1 }],
    });
    if (classExists) {
      return res.json({
        success: true,
        message: "Data fetched successfully.",
        data: classExists,
      });
    } else {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "Class not found",
            param: "server",
            location: "body",
          },
        ],
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

// @route    POST api/users/updateClass/:class_id
// @desc     edit class
// @access   Private
router.put(
  "/updateClass/:class_id",
  auth,
  [
    check("discipline", "Discipline field is required").not().isEmpty(),
    check("topics", "Topics are required").not().isEmpty(),
    check("class_title", "Class title is required").not().isEmpty(),
    check("class_subtitle", "Class subtitle is required").not().isEmpty(),
    check("class_description", "Class description is required").not().isEmpty(),
    check("class_level", "Class level is required").not().isEmpty(),
    check("language_of_class", "Language of class is required").not().isEmpty(),
    check("cover_image", "Cover image is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      discipline,
      topics,
      topics_text,
      class_title,
      class_subtitle,
      class_description,
      class_level,
      language_of_class,
      cover_image,
      price,
      session_duration,
    } = req.body;

    try {
      var class_id = req.params.class_id;

      var classObject = {};
      classObject.discipline = discipline;
      classObject.topics = topics;
      if (session_duration) {
        classObject.session_duration = session_duration;
      }
      classObject.topics_text = topics_text;
      classObject.class_title = class_title;
      classObject.class_subtitle = class_subtitle;
      classObject.class_description = class_description;
      classObject.class_level = class_level; //1 => "Beginner", 2 => "Intermediate", 3 => "Advanced"
      classObject.language_of_class = language_of_class;
      classObject.cover_image = cover_image;
      classObject.price = price;

      classObject.updated_at = new Date();
      var classData = await Classes.findOneAndUpdate(
        { _id: class_id },
        { $set: classObject }
      );
      try {
        await classDetailsSchema.updateMany(
          { class_id: class_id },
          { $set: { class_title: class_title } }
        );

        await BookedClasses.updateMany(
          { class_id: class_id },
          { $set: { class_title: class_title } }
        );
      } catch (e) {
        console.log(e);
      }
      // const newClass = new Classes(classObject);

      // const createdClass = await newClass.save();

      res.json({
        success: true,
        message: "Class updated successfully",
      });
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
  }
);

// @route    GET api/users/getTeacherProfile
// @desc     get class detail of auth teacher using id
// @access   Private
router.get("/getTeacherProfile", auth, async (req, res) => {
  try {
    var created_by = req.user.id;
    // console.log(created_by)
    // await User.updateMany(
    //   {
    //     deleted: 0
    //   },
    //   {
    //     $set : {
    //       dob : "08-03-1999",
    //       age : 22
    //     }
    //   }
    //   );
    var teacher = await User.findOne(
      {
        _id: created_by,
        account_status: 1,
      },
      {
        _id: 1,
        deleted: 1,
        phone: 1,
        user_created_by_admin: 1,
        about_expertise: 1,
        accept_terms_and_conditions: 1,
        account_status: 1,
        account_verified: 1,
        age: 1,
        created_at: 1,
        expertise: 1,
        intro_video: { $ifNull: ["$intro_video", ""] },
        language: 1,
        otp: 1,
        otp_expired: 1,
        planned_topics: 1,
        profile_created: 1,
        profile_image: 1,
        topics: 1,
        user_role: 1,
        city: 1,
        dob: 1,
        first_name: 1,
        gender: 1,
        last_name: 1,
        state: 1,
        street_address: 1,
        updated_at: 1,
        zip_code: 1,
      }
    );

    if (!teacher) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "Teacher account does not exists",
            param: "server",
            location: "body",
          },
        ],
      });
    }

    return res.json({
      success: true,
      message: "Data fetched successfully.",
      data: teacher,
    });
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

// @route    PUT api/users/getTagsId
// @desc     get tag id by creating it or finding previous record
// @access   Private
router.put("/getTagsId", auth, async (req, res) => {
  const { tags, added_tags } = req.body;

  try {
    if (tags && tags.length > 0) {
      try {
        await Tags.insertMany(tags, { ordered: false });
      } catch (e) {
        console.log("Has some duplicate entries");
      }
    }
    var addedTag = await Tags.find(
      { tag_name: { $in: added_tags } },
      { _id: 1 }
    );
    // var addedTag = await Tags.findOne({tag_name:tags.tag_name,tag_type:tags.tag_type});

    // if(!addedTag){
    //   var addedTag = await Tags.findOneAndUpdate(
    //     {tag_name:tags.tag_name,tag_type:tags.tag_type},
    //     {$set: tags},
    //     {new : true, upsert: true}
    //     )
    // }
    var result = addedTag.map(function (a) {
      return a._id;
    });
    res.json({
      success: true,
      message: "Tag result",
      data: result,
    });
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

// @route    GET api/users/getSessionsOfSelectedMonth
// @desc     get records of sessions of selected month (classes)
// @access   Private
router.get("/getSessionsOfSelectedMonth", auth, async (req, res) => {
  try {
    var day = req.query.day;
    var month = req.query.month;
    var year = req.query.year;
    if (!year || !month) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "year or month query string parameter is missing",
            param: "query string",
            location: "body",
          },
        ],
      });
    }

    var search = {
      month_of_class: month,
      year_of_class: year,
      created_by: req.user.id,
      deleted : 0
    };

    if (day) {
      search.day_of_class = day;
    }

    var result = await classDetailsSchema.find(search);
    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: result,
    });
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

// @route    GET api/users/getSessionDetail
// @desc     get detail of session
// @access   Private
router.get(
  "/getSessionDetail/:class_id/:session_id",
  auth,
  async (req, res) => {
    try {
      //   setInterval(function () {
      // var currentdateTest = new Date();

      //     var datetimeTest = "Last Sync: " + currentdateTest.getDate() + "/"
      //   + (currentdateTest.getMonth()+1)  + "/"
      //   + currentdateTest.getFullYear() + " @ "
      //   + currentdateTest.getHours() + ":"
      //   + currentdateTest.getMinutes() + ":"
      //   + currentdateTest.getSeconds();
      //     console.log(datetimeTest);
      //   }, 1000);

      var class_id = req.params.class_id;
      var session_id = req.params.session_id;
      var created_by = req.user.id;

      // var session_id = "632e8a34e03370803d91eb32"
      // var class_id = "632d7a26bc6643f0d634e1de"
      // var created_by = "620cf1262ce777700dd96cde"

      if (!session_id || !class_id) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "session_id or class_id parameter is missing",
              param: "params",
              location: "body",
            },
          ],
        });
      }
      var teacher = await User.findOne(
        {
          _id: created_by,
          account_status: 1,
        },
        {
          phone: 1,
          profile_image: 1,
          first_name: 1,
          last_name: 1,
        }
      );
      if (!teacher) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "Teacher account does not exists",
              param: "server",
              location: "body",
            },
          ],
        });
      } else {
        var haveClass = await Classes.aggregate([
          {
            $match: {
              _id: ObjectId(class_id),
              $or: [{ class_status: 0 }, { class_status: 1 }],
            },
          },
          {
            $lookup: {
              from: "booked_classes",
              localField: "_id",
              foreignField: "class_id",
              pipeline: [
                {
                  $match: {
                    session_id: ObjectId(session_id),
                  },
                },
                {
                  $project: {
                    booked_by: 1,
                    transaction_id: 1,
                  },
                },
              ],
              as: "bookingArr",
            },
          },
          {
            $unwind: {
              path: "$bookingArr",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "transactions",
              localField: "bookingArr.transaction_id",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    user_id: 1,
                    channel_id: 1,
                  },
                },
              ],
              as: "classToken",
            },
          },
          {
            $unwind: {
              path: "$classToken",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              discipline: 1,
              class_status: 1,
              topics_text: 1,
              class_title: 1,
              class_subtitle: 1,
              class_description: 1,
              class_level: 1,
              language_of_class: 1,
              cover_image: 1,
              type_of_class: 1,
              session_type: 1,
              session_duration: 1,
              price: 1,
              max_students_allowed: 1,
              location: 1,
              created_at: 1,
              updated_at: 1,
              topics: 1,
              class_detail: 1,
              created_by: 1,
              enrolled_students: 1,
              classToken: { $ifNull: ["$classToken", ""] },
              address_or_class_link: {
                $ifNull: ["$address_or_class_link", ""],
              },
            },
          },
        ]);
        var classExists = "";
        if (haveClass.length > 0) {
          classExists = haveClass[0];
        }

        if (classExists) {
          var getTheseTags = [];
          var selectedTagsCount = classExists.topics.length;
          for (var tag = 0; tag < selectedTagsCount; tag++) {
            getTheseTags.push(ObjectId(classExists.topics[tag]));
          }
          var addedTag = await Tags.find(
            { _id: { $in: getTheseTags } },
            { tag_name: 1 }
          );
          var sessionData = await classDetailsSchema.findOne({
            _id: session_id,
            deleted : 0
          });
          //var sessionDataForToday = await classDetailsSchema.findOne({_id:session_id, class_session_date: {$gte : new Date()}});
          var triggerTime = 0;
          if (!sessionData) {
            return res.status(400).send({
              success: false,
              errors: [
                {
                  msg: "Session not found",
                  param: "server",
                  location: "body",
                },
              ],
            });
          }
          function tConvert(time) {
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [
              time,
            ];

            if (time.length > 1) {
              // If time format correct
              time = time.slice(1); // Remove full string match value
              time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
              time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join(""); // return adjusted time or original string
          }
          const dateInPast = function (firstDate, secondDate) {
            if (
              firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)
            ) {
              return 0;
            } else if (
              firstDate.setHours(0, 0, 0, 0) == secondDate.setHours(0, 0, 0, 0)
            ) {
              return 1;
            }
            return 2;
          };
          function getMinutes(str) {
            var time = str.split(":");
            return time[0] * 60 + time[1] * 1;
          }
          function getMinutesNow() {
            var timeNow = new Date();
            return timeNow.getHours() * 60 + timeNow.getMinutes();
          }
          var start_time_of_class = sessionData.start_time_of_class;
          var end_time_of_class = sessionData.end_time_of_class;
          var now = getMinutesNow();
          var start = getMinutes(start_time_of_class);
          var end = getMinutes(end_time_of_class);
          //var buttonLabel = 'START SESSION';
          if (start > end) end += getMinutes("24:00");
          const session_date = new Date(sessionData.class_session_date);
          const todayDate = new Date();
          var hitApiOf = 0;
          var showCancelClassButton = true;
          const currentDateToMatch = new Date();
          var dateStatus = dateInPast(
            sessionData.class_session_date,
            currentDateToMatch
          );
          if (sessionData.session_progress_status == 3) {
            sessionLable = "CLASS CANCELLED";
            hitApiOf = 0;
            showCancelClassButton = false;
          } else if (dateStatus == 1) {
            if (now < start) {
              console.log(now);
              console.log(start);
              sessionLable =
                "SESSION WILL START ON " +
                tConvert(sessionData.start_time_of_class) +
                " - GMT";
              hitApiOf = 0;
              showCancelClassButton = true;
              triggerTime = (start - now) * 60000;
            } else if (
              now >= start &&
              sessionData.session_progress_status == 0 &&
              now < end
            ) {
              sessionLable = "START SESSION";
              hitApiOf = 1;
              showCancelClassButton = true;
            } else if (sessionData.session_progress_status == 0 && now > end) {
              sessionLable = "SESSION EXPIRED";
              hitApiOf = 0;
              showCancelClassButton = false;
            } else if (
              now >= start &&
              sessionData.session_progress_status == 1 &&
              now < end
            ) {
              sessionLable = "SESSION IN PROGRESS";
              hitApiOf = 1;
              showCancelClassButton = false;
            } else if (sessionData.session_progress_status == 1 && now > end) {
              hitApiOf = 2;
              showCancelClassButton = false;

              sessionLable = "GIVE RATING";
            } else if (sessionData.session_progress_status == 2) {
              var checkRating = await BookedClasses.findOne(
                { session_id: session_id, rating: { $gt: 0 } },
                { _id: 1 }
              );
              if (checkRating) {
                sessionLable = "SESSION COMPLETED";
                hitApiOf = 0;
                showCancelClassButton = false;
              } else {
                hitApiOf = 2;
                sessionLable = "GIVE RATING";
                showCancelClassButton = false;
              }
            } else if (classExists.enrolled_students == 0) {
              sessionLable = "NO STUDENT ENROLLED YET";
              hitApiOf = 0;
              showCancelClassButton = true;
            }
          } else if (dateStatus == 2) {
            var sessionLable =
              "SESSION WILL START ON " +
              new Date(sessionData.class_date).toDateString();
            hitApiOf = 0;
            showCancelClassButton = true;
            if (classExists.enrolled_students == 0) {
              sessionLable = "NO STUDENT ENROLLED YET";
              hitApiOf = 0;
              showCancelClassButton = true;
            }
          } else if (dateStatus == 0) {
            if (sessionData.session_progress_status == 0) {
              sessionLable = "SESSION EXPIRED";
              hitApiOf = 0;
              showCancelClassButton = false;
            } else if (sessionData.session_progress_status == 1) {
              hitApiOf = 2;
              sessionLable = "GIVE RATING";
              showCancelClassButton = false;
            } else if (sessionData.session_progress_status == 2) {
              var checkRating = await BookedClasses.findOne(
                { session_id: session_id, rating: { $gt: 0 } },
                { _id: 1 }
              );
              if (checkRating) {
                sessionLable = "SESSION COMPLETED";
                hitApiOf = 0;
                showCancelClassButton = false;
              } else {
                hitApiOf = 2;
                sessionLable = "GIVE RATING";
                showCancelClassButton = false;
              }
            } else if (classExists.enrolled_students == 0) {
              sessionLable = "NO STUDENT ENROLLED YET";
              hitApiOf = 0;
              showCancelClassButton = false;
            }
          }

          return res.json({
            success: true,
            message: "Data fetched successfully.",
            data: {
              classData: classExists,
              sessionData: sessionData,
              teacherProfile: teacher,
              addedTag: addedTag,
              sessionLable: sessionLable,
              hitApiOf: hitApiOf,
              showCancelClassButton: showCancelClassButton,
              triggerTime: triggerTime,
            },
          });
        } else {
          return res.status(400).send({
            success: false,
            errors: [
              {
                msg: "Class not found",
                param: "server",
                location: "body",
              },
            ],
          });
        }
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({
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
  }
);

// @route    GET api/users/getSessionDetailForStudent
// @desc     get detail of session
// @access   Private
router.get(
  "/getSessionDetailForStudent/:booking_id",
  auth,
  async (req, res) => {
    try {
      var userId = req.user.id;
      var booking_id = req.params.booking_id;

      var checkSessionStatus = await BookedClasses.findOne({ _id: booking_id });
      if (!checkSessionStatus) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No booking record found",
              param: "params",
              location: "body",
            },
          ],
        });
      }
      var class_id = checkSessionStatus.class_id;
      var session_id = checkSessionStatus.session_id;
      var created_by = checkSessionStatus.created_by;
      if (!session_id || !class_id) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "session_id or class_id parameter is missing",
              param: "params",
              location: "body",
            },
          ],
        });
      }

      var teacher = await User.findOne(
        {
          _id: created_by,
          account_status: 1,
        },
        {
          phone: 1,
          profile_image: 1,
          first_name: 1,
          last_name: 1,
        }
      );

      if (!teacher) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "Teacher account does not exists",
              param: "server",
              location: "body",
            },
          ],
        });
      } else {
        var haveClass = await Classes.aggregate([
          {
            $match: {
              _id: class_id,
              $or: [{ class_status: 0 }, { class_status: 1 }],
            },
          },
          {
            $lookup: {
              from: "transactions",
              localField: "_id",
              foreignField: "class_id",
              pipeline: [
                {
                  $match: {
                    user_id: ObjectId(userId),
                  },
                },
                {
                  $project: {
                    user_id: 1,
                    channel_id: 1,
                  },
                },
              ],
              as: "classToken",
            },
          },
          {
            $unwind: {
              path: "$classToken",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              discipline: 1,
              class_status: 1,
              topics: 1,
              topics_text: 1,
              class_title: 1,
              class_subtitle: 1,
              class_description: 1,
              class_level: 1,
              language_of_class: 1,
              cover_image: 1,
              type_of_class: 1,
              session_type: 1,
              session_duration: 1,
              price: 1,
              max_students_allowed: 1,
              enrolled_students: 1,
              created_by: 1,
              location: 1,
              created_at: 1,
              class_detail: 1,
              updated_at: 1,
              classToken: { $ifNull: ["$classToken", ""] },
              address_or_class_link: {
                $ifNull: ["$address_or_class_link", ""],
              },
            },
          },
        ]);

        var classExists = "";
        if (haveClass.length > 0) {
          classExists = haveClass[0];
        }
        if (classExists) {
          var getTheseTags = [];
          var selectedTagsCount = classExists.topics.length;
          for (var tag = 0; tag < selectedTagsCount; tag++) {
            getTheseTags.push(ObjectId(classExists.topics[tag]));
          }
          var addedTag = await Tags.find(
            { _id: { $in: getTheseTags } },
            { tag_name: 1 }
          );
          var sessionData = await BookedClasses.findOne({ _id: booking_id });
          //var sessionDataForToday = await classDetailsSchema.findOne({_id:session_id, class_session_date: {$gte : new Date()}});
          var triggerTime = 0;

          if (!sessionData) {
            return res.status(400).send({
              success: false,
              errors: [
                {
                  msg: "Session not found",
                  param: "server",
                  location: "body",
                },
              ],
            });
          }
          function tConvert(time) {
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [
              time,
            ];

            if (time.length > 1) {
              // If time format correct
              time = time.slice(1); // Remove full string match value
              time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
              time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join(""); // return adjusted time or original string
          }
          function getMinutes(str) {
            var time = str.split(":");
            return time[0] * 60 + time[1] * 1;
          }
          function getMinutesNow() {
            var timeNow = new Date();
            return timeNow.getHours() * 60 + timeNow.getMinutes();
          }
          var start_time_of_class = sessionData.start_time_of_class;
          var end_time_of_class = sessionData.end_time_of_class;
          var now = getMinutesNow();
          var start = getMinutes(start_time_of_class);
          var end = getMinutes(end_time_of_class);
          //var buttonLabel = 'START SESSION';
          if (start > end) end += getMinutes("24:00");
          const session_date = new Date(sessionData.class_session_date);
          const todayDate = new Date();
          var hitApiOf = 0;
          var showCancelClassButton = true;

          const dateInPast = function (firstDate, secondDate) {
            if (
              firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)
            ) {
              return 0;
            } else if (
              firstDate.setHours(0, 0, 0, 0) == secondDate.setHours(0, 0, 0, 0)
            ) {
              return 1;
            }
            return 2;
          };
          const currentDateToMatch = new Date();
          var dateStatus = dateInPast(
            sessionData.class_session_date,
            currentDateToMatch
          );
          if (checkSessionStatus.session_progress_status == 3) {
            sessionLable = "CLASS CANCELLED";
            hitApiOf = 0;
            showCancelClassButton = false;
          } else if (dateStatus == 1) {
            if (now < start) {
              sessionLable =
                "SESSION WILL START ON " +
                tConvert(sessionData.start_time_of_class) +
                " - GMT";
              hitApiOf = 0;
              showCancelClassButton = true;
              triggerTime = (start - now) * 60000;
            } else if (
              now >= start &&
              checkSessionStatus.session_progress_status == 0 &&
              now < end
            ) {
              sessionLable = "START SESSION";
              hitApiOf = 1;
              showCancelClassButton = true;
            } else if (
              checkSessionStatus.session_progress_status == 0 &&
              now > end
            ) {
              sessionLable = "SESSION EXPIRED";
              hitApiOf = 0;
              showCancelClassButton = false;
            } else if (
              now >= start &&
              checkSessionStatus.session_progress_status == 1 &&
              now < end
            ) {
              sessionLable = "SESSION IN PROGRESS";
              hitApiOf = 1;
              showCancelClassButton = false;
            } else if (
              checkSessionStatus.session_progress_status == 1 &&
              now > end
            ) {
              hitApiOf = 2;
              sessionLable = "GIVE RATING";
              showCancelClassButton = false;
            } else if (checkSessionStatus.session_progress_status == 2) {
              var ratingObject = {};
              ratingObject.rating_given_to = created_by;
              ratingObject.user_id = req.user.id;
              ratingObject.class_id = class_id;
              ratingObject.session_id = session_id;
              var checkRating = await TeachersRating.findOne(ratingObject, {
                _id: 1,
              });
              if (checkRating) {
                sessionLable = "SESSION COMPLETED";
                showCancelClassButton = false;

                hitApiOf = 0;
              } else {
                hitApiOf = 2;
                sessionLable = "GIVE RATING";
                showCancelClassButton = false;
              }
            }
          } else if (dateStatus == 2) {
            var sessionLable =
              "SESSION WILL START ON " +
              new Date(sessionData.class_date).toDateString();
            hitApiOf = 0;
            showCancelClassButton = true;
          } else if (dateStatus == 0) {
            if (checkSessionStatus.session_progress_status == 0) {
              sessionLable = "SESSION EXPIRED";
              hitApiOf = 0;
              showCancelClassButton = false;
            } else if (checkSessionStatus.session_progress_status == 1) {
              hitApiOf = 2;
              sessionLable = "GIVE RATING";
              showCancelClassButton = false;
            } else if (checkSessionStatus.session_progress_status == 2) {
              var ratingObject = {};
              ratingObject.rating_given_to = created_by;
              ratingObject.user_id = req.user.id;
              ratingObject.class_id = class_id;
              ratingObject.session_id = session_id;
              var checkRating = await TeachersRating.findOne(ratingObject, {
                _id: 1,
              });
              if (checkRating) {
                sessionLable = "SESSION COMPLETED";
                hitApiOf = 0;
                showCancelClassButton = false;
              } else {
                hitApiOf = 2;
                sessionLable = "GIVE RATING";
                showCancelClassButton = false;
              }
            }
          }
          var currentdateForTesting = new Date();
          var datetimeForTesting =
            "Last Sync: " +
            currentdateForTesting.getDate() +
            "/" +
            (currentdateForTesting.getMonth() + 1) +
            "/" +
            currentdateForTesting.getFullYear() +
            " @ " +
            currentdateForTesting.getHours() +
            ":" +
            currentdateForTesting.getMinutes() +
            ":" +
            currentdateForTesting.getSeconds();
          return res.json({
            success: true,
            message: "Data fetched successfully.",
            data: {
              classData: classExists,
              sessionData: sessionData,
              teacherProfile: teacher,
              addedTag: addedTag,
              sessionLable: sessionLable,
              hitApiOf: hitApiOf,
              showCancelClassButton: showCancelClassButton,
              booking_id: booking_id,
              triggerTime: triggerTime,
              datetimeForTesting: datetimeForTesting,
            },
          });
        } else {
          return res.status(400).send({
            success: false,
            errors: [
              {
                msg: "Class not found",
                param: "server",
                location: "body",
              },
            ],
          });
        }
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({
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
  }
);

// @route    POST api/users/addAvailablility
// @desc     add availablility
// @access   Private
router.post(
  "/addAvailablility",
  auth,
  [
    check("start_date", "Start date is required").not().isEmpty(),
    check("start_time", "Start time is required").not().isEmpty(),
    check("end_time", "End time is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      start_date,
      start_time,
      end_time,
      //end_date,
      repeat_period,
    } = req.body;

    try {
      var latestDate = new Date(start_date + " GMT-0530");
      var year = latestDate.getFullYear();
      var month = latestDate.getMonth() + 1;
      var day = latestDate.getDate();
      var previousAvailabilities = [];
      const response = await axios.get(
        `${process.env.INNER_APIS_BASE}/v1/users/getAvailablilityForStudent/${
          req.user.id
        }/${year + "-" + month + "-" + day}?month=${month}&year=${year}`
      );
      if (response.data && response.data.success) {
        previousAvailabilities = response.data.previousData;
      }
      function getMinutes(str) {
        var time = str.split(":");
        return time[0] * 60 + time[1] * 1;
      }
      const messageAsPerDateAndTime = (
        start_time_of_class,
        end_time_of_class
      ) => {
        return `Availability is already added with time slot of ${start_time_of_class} - ${end_time_of_class}`;
      };
      var errorsArray = [];

      for (var i = 0; i < previousAvailabilities.length; i++) {
        var endTimeEnterByUser = getMinutes(end_time);
        var endTimeInRecords = getMinutes(
          previousAvailabilities[i].split(" to ")[1]
        );
        var startEnterByUser = getMinutes(start_time);
        var startTimeInRecords = getMinutes(
          previousAvailabilities[i].split(" to ")[0]
        );
        if (
          (startTimeInRecords < startEnterByUser &&
            startEnterByUser < endTimeInRecords) ||
          (startTimeInRecords < endTimeEnterByUser &&
            endTimeEnterByUser < endTimeInRecords) ||
          (startEnterByUser < startTimeInRecords &&
            startTimeInRecords < endTimeEnterByUser) ||
          (startEnterByUser < endTimeInRecords &&
            endTimeInRecords < endTimeEnterByUser) ||
          (startTimeInRecords == startEnterByUser &&
            endTimeInRecords == endTimeEnterByUser)
        ) {
          console.log("issue found");
          errorsArray.push({
            msg: messageAsPerDateAndTime(
              previousAvailabilities[i].split(" to ")[0],
              previousAvailabilities[i].split(" to ")[1]
            ),
          });
        }
      }
      if (errorsArray.length > 0) {
        return res.status(400).send({
          success: false,
          errors: errorsArray,
        });
      }

      // var checkExistance = await Availability.findOne({
      //   start_time: {$lte : start_time},
      //   end_time: {$gte : end_time},
      //   start_date:{ $lte:new Date()},
      //   end_date:{ $gte:new Date()}
      // });

      // if(checkExistance){
      //   return res.status(400).send({
      //     success:false,
      //     "errors": [
      //       {
      //           "msg": "Availability already added for this time period",
      //           "param": "server",
      //           "location": "body"
      //       }
      //   ]
      //   });
      // }

      var availabilityObject = {};
      availabilityObject.start_date = new Date(start_date + " GMT-0530");
      //availabilityObject.end_date = end_date;
      availabilityObject.start_time = start_time;
      availabilityObject.end_time = end_time;
      availabilityObject.repeat_period = repeat_period;
      availabilityObject.created_by = req.user.id;
      availabilityObject.created_at = new Date();
      availabilityObject.day = new Date(start_date).getDate();
      availabilityObject.month =
        Number(new Date(start_date).getMonth()) + Number(1);
      availabilityObject.year = new Date(start_date).getFullYear();
      //  await Availability.findOneAndUpdate(
      //   {category_name: category_name},
      //   { $set: categoryObject },
      //   {new:true,upsert:true}
      // );
      const newAvailability = new Availability(availabilityObject);

      await newAvailability.save();
      res.json({
        success: true,
        message: "Record updated successfully",
        data: newAvailability,
      });
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
  }
);

// @route    GET api/users/getAvailablilitiesList
// @desc     add availablility
// @access   Private
router.get("/getAvailablilitiesList", auth, async (req, res) => {
  try {
    var monthQuery = Number(req.query.month);
    let month = monthQuery.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    var year = req.query.year;
    if (!year || !month) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "year or month query string parameter is missing",
            param: "query string",
            location: "body",
          },
        ],
      });
    }
    var currentDate = new Date();

    if (req.query.source) {
      var allAvailablility = await Availability.find({
        created_by: req.user.id,
      });
      var allAvailablilityOfNeverType = await Availability.aggregate([
        {
          $match: {
            created_by: ObjectId(req.user.id),
            repeat_period: 0,
            month: parseInt(month),
            year: parseInt(year),
            start_date: { $gte: currentDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$start_date" } },
            items: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      var preSecetedValues = [];

      for (var i = 0; i < allAvailablilityOfNeverType.length; i++) {
        var completeDate = allAvailablilityOfNeverType[i]._id.split("-");
        if (
          !preSecetedValues.some(
            (data) => data.day === parseInt(completeDate[2])
          )
        ) {
          preSecetedValues.push({
            year: parseInt(completeDate[0]),
            month: parseInt(completeDate[1]),
            day: parseInt(completeDate[2]),
            className: "orangeDay",
          });
        }
      }

      var everyYearRepeatRecord = await Availability.aggregate([
        {
          $match: {
            created_by: ObjectId(req.user.id),
            repeat_period: 5,
            month: parseInt(month),
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$start_date" } },
            items: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      for (var i = 0; i < everyYearRepeatRecord.length; i++) {
        var completeDate = everyYearRepeatRecord[i]._id.split("-");
        if (
          !preSecetedValues.some(
            (data) => data.day === parseInt(completeDate[2])
          )
        ) {
          preSecetedValues.push({
            year: parseInt(year),
            month: parseInt(completeDate[1]),
            day: parseInt(completeDate[2]),
            className: "orangeDay",
          });
        }
      }
      var everyMonthRepeatRecord = await Availability.aggregate([
        {
          $match: {
            created_by: ObjectId(req.user.id),
            repeat_period: 4,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$start_date" } },
            items: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      for (var i = 0; i < everyMonthRepeatRecord.length; i++) {
        var completeDate = everyMonthRepeatRecord[i]._id.split("-");
        if (
          !preSecetedValues.some(
            (data) => data.day === parseInt(completeDate[2])
          )
        ) {
          preSecetedValues.push({
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(completeDate[2]),
            className: "orangeDay",
          });
        }
      }

      var DatesArray = [];
      var outputArray = [];
      function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var startDateUTC = Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        var endDateUTC = Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
      }
      var daysInMonth = new Date(year, month, 0).getDate();
      for (var avail = 0; avail < allAvailablility.length; avail++) {
        for (var days = 1; days <= daysInMonth; days++) {
          let formattedDay = days.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          var dateOfArray = year + "-" + month + "-" + formattedDay;
          var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
          var diffDaysFromCurrentDate = await daysBetween(
            allAvailablility[avail].start_date,
            new Date(dateOfArray)
          );
          var detail = allAvailablility[avail];
          if (detail && detail.repeat_period == 1) {
            if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
              if (
                !preSecetedValues.some(
                  (data) => data.day === parseInt(formattedDay)
                )
              ) {
                preSecetedValues.push({
                  year: parseInt(year),
                  month: parseInt(month),
                  day: parseInt(formattedDay),
                  className: "orangeDay",
                });
              }
            }
          }
          if (detail && detail.repeat_period == 2) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 7 == 0
            ) {
              if (
                !preSecetedValues.some(
                  (data) => data.day === parseInt(formattedDay)
                )
              ) {
                preSecetedValues.push({
                  year: parseInt(year),
                  month: parseInt(month),
                  day: parseInt(formattedDay),
                  className: "orangeDay",
                });
              }
            }
          }
          if (detail && detail.repeat_period == 3) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 14 == 0
            ) {
              if (
                !preSecetedValues.some(
                  (data) => data.day === parseInt(formattedDay)
                )
              ) {
                preSecetedValues.push({
                  year: parseInt(year),
                  month: parseInt(month),
                  day: parseInt(formattedDay),
                  className: "orangeDay",
                });
              }
            }
          }
        }
      }
      return res.json({
        success: true,
        message: "Record fetched successfully",
        data: preSecetedValues,
      });
    } else {
      var allAvailablility = await Availability.find(
        {
          created_by: req.user.id,
        },
        { _id: 1, repeat_period: 1, start_date: 1 }
      );

      var DatesArray = [];
      var outputArray = {};
      console.log(allAvailablility);
      function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var startDateUTC = Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        var endDateUTC = Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
      }
      var daysInMonth = new Date(year, month, 0).getDate();
      for (var avail = 0; avail < allAvailablility.length; avail++) {
        console.log("loop working", avail);
        for (var days = 1; days <= daysInMonth; days++) {
          let formattedDay = days.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          let dateOfArray = year + "-" + month + "-" + formattedDay;
          var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
          var diffDaysFromCurrentDate = await daysBetween(
            allAvailablility[avail].start_date,
            new Date(dateOfArray)
          );

          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 1
          ) {
            if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 2
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 7 == 0
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 3
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 14 == 0
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            (allAvailablility[avail].repeat_period == 0 ||
              allAvailablility[avail].repeat_period == 4)
          ) {
            console.log("Repeating this loop", diffDays);
            console.log("diffDaysFromCurrentDate", diffDaysFromCurrentDate);

            if (diffDays == 0 && diffDaysFromCurrentDate == 0) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 5
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              allAvailablility[avail].month == month &&
              allAvailablility[avail].day == days &&
              year >= currentDate.getFullYear()
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
        }
      }
    }
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: outputArray,
      allAvailablility,
    });
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

// @route    GET api/users/getAvailablility/:id
// @desc     add availablility
// @access   Private
router.get("/getAvailablility/:availabilityDate", auth, async (req, res) => {
  try {
    var monthQuery = Number(req.query.month);
    let month = monthQuery.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    var year = req.query.year;
    //days = ('0' + days).slice(-2);
    var availabilityDate = req.params.availabilityDate;
    var days = new Date(availabilityDate).getDate();

    if (!availabilityDate) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "availabilityDate is required",
            param: "params",
            location: "body",
          },
        ],
      });
    }

    var currentDate = new Date();

    var allAvailablility = await Availability.find({
      created_by: req.user.id,
    });

    var outputArray = [];
    function daysBetween(startDate, endDate) {
      var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var startDateUTC = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      var endDateUTC = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
    }
    for (var avail = 0; avail < allAvailablility.length; avail++) {
      let dateOfArray = availabilityDate;
      var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
      var diffDaysFromCurrentDate = await daysBetween(
        allAvailablility[avail].start_date,
        new Date(dateOfArray)
      );
      var detail = allAvailablility[avail];
      if (detail && detail.repeat_period == 1) {
        if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
          outputArray.push({
            start: availabilityDate + " " + detail.start_time,
            end: availabilityDate + " " + detail.end_time,
            title: "Available",
          });
        }
      }
      if (detail && detail.repeat_period == 2) {
        if (
          diffDays >= 0 &&
          diffDaysFromCurrentDate >= 0 &&
          diffDaysFromCurrentDate % 7 == 0
        ) {
          outputArray.push({
            start: availabilityDate + " " + detail.start_time,
            end: availabilityDate + " " + detail.end_time,
            title: "Available",
          });
        }
      }
      if (detail && detail.repeat_period == 3) {
        if (
          diffDays >= 0 &&
          diffDaysFromCurrentDate >= 0 &&
          diffDaysFromCurrentDate % 14 == 0
        ) {
          outputArray.push({
            start: availabilityDate + " " + detail.start_time,
            end: availabilityDate + " " + detail.end_time,
            title: "Available",
          });
        }
      }
      if (detail && (detail.repeat_period == 0 || detail.repeat_period == 4)) {
        if (diffDaysFromCurrentDate == 0) {
          outputArray.push({
            start: availabilityDate + " " + detail.start_time,
            end: availabilityDate + " " + detail.end_time,
            title: "Available",
          });
        }
      }
      if (detail && detail.repeat_period == 5) {
        if (
          diffDays >= 0 &&
          detail.month == month &&
          detail.day == days &&
          year >= currentDate.getFullYear()
        ) {
          outputArray.push({
            start: availabilityDate + " " + detail.start_time,
            end: availabilityDate + " " + detail.end_time,
            title: "Available",
          });
        }
      }
    }

    res.json({
      success: true,
      message: "Record fetch successfully",
      data: outputArray,
    });
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

// @route    PUT api/users/updateBasicProfileInfoOfStudent
// @desc     update student as well as teacher basic info
// @access   Private
router.put(
  "/updateBasicProfileInfoOfStudent",
  auth,
  [
    check("first_name", "Firstname is required").not().isEmpty(),
    check("gender_identity", "Please select gender").matches(/^[0-9]+$/),
    check("dob", "Date of birth is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {
      first_name,
      last_name,
      gender_identity,
      dob,
      street_address,
      city,
      state,
      zip_code,
      age,
      language,
      profile_image,
      topics,
    } = req.body;

    try {
      var userData = await User.findOne(
        {
          _id: req.user.id,
          deleted: 0,
          account_status: 1,
          account_verified: 1,
        },
        { _id: 1 }
      );
      if (userData) {
        var userDetails = {};
        var message = "";
        userDetails.first_name = first_name;
        userDetails.last_name = last_name;
        userDetails.gender = gender_identity;
        userDetails.profile_image = profile_image;
        userDetails.topics = topics;
        userDetails.dob = dob;
        userDetails.age = age;
        userDetails.street_address = street_address;
        userDetails.city = city;
        userDetails.state = state;
        userDetails.zip_code = zip_code;
        userDetails.profile_created = true;
        userDetails.language = language;
        userDetails.updated_at = new Date();

        message = "Profile updated successfully.";

        await User.findOneAndUpdate(
          {
            _id: req.user.id,
            deleted: 0,
            account_status: 1,
            account_verified: 1,
          },
          { $set: userDetails }
        );
        userData = await User.findOne({ _id: req.user.id, deleted: 0 }).select(
          "-password"
        );
        console.log(userData);

        res.json({
          success: true,
          message: message,
          data: {
            id: userData.id,
            user_role: userData.user_role,
            profile_created: userData.profile_created,
            profile: userData,
          },
        });
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found",
              param: "token",
              location: "body",
            },
          ],
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
  }
);

// @route    GET api/users/searchTeacherWithClassFilters
// @desc     get classes list of auth teacher
// @access   Private
router.get("/searchTeacherWithClassFilters", auth, async (req, res) => {
  try {
    const {
      discipline_or_topic,
      address_or_class_link,
      time_of_class,
      session_type,
      private_or_group,
      class_level,
      minimum_price,
      maximum_price,
      page,
    } = req.query;
    var searchQuery = {};
    searchQuery["class_status"] = 1;

    var pageNumber = 1;
    if (page) {
      pageNumber = page;
    }
    var limit = 10;
    var skip = (pageNumber - 1) * limit;
    console.log(skip);
    console.log("pageNumber", pageNumber);
    var currentDateForSearch = new Date();
    var month = currentDateForSearch.getMonth() + 1;
    var formattedCurrentDate = `${currentDateForSearch.getFullYear()}-${(
      "0" + month
    ).slice(-2)}-${("0" + currentDateForSearch.getDate()).slice(
      -2
    )}T00:00:00.000Z`;
    var dateForTest = new Date(formattedCurrentDate);
    if (discipline_or_topic) {
      searchQuery["$or"] = [
        { discipline: { $regex: discipline_or_topic, $options: "i" } },
        { class_title: { $regex: discipline_or_topic, $options: "i" } },
        { topics_text: { $regex: discipline_or_topic, $options: "i" } },
      ];
    }
    if (address_or_class_link) {
      searchQuery["address_or_class_link"] = {
        $regex: address_or_class_link,
        $options: "i",
      };
    }
    if (time_of_class && time_of_class == 1) {
      var date = new Date().getDate();
      var month = Number(new Date().getMonth()) + Number(1);
      var year = new Date().getFullYear();
      let complete_date = month + "-" + date + "-" + year;
      searchQuery["class_details.class_date"] = {
        $regex: complete_date,
        $options: "i",
      };
    } else if (time_of_class && time_of_class == 2) {
      var class_session_date = formattedCurrentDate;
      class_session_date.setDate(class_session_date.getDate() + 7);
      searchQuery["class_details.class_session_date"] = {
        $gte: formattedCurrentDate,
        $lt: class_session_date,
      };
    } else if (time_of_class && time_of_class == 3) {
      searchQuery["class_details.month_of_class"] = new Date().getMonth() + 1;
      searchQuery["class_details.class_session_date"] = {
        $gte: formattedCurrentDate,
      };
    } else if (time_of_class && time_of_class == 4) {
      searchQuery["class_details.year_of_class"] = new Date().getFullYear();
      searchQuery["class_details.class_session_date"] = {
        $gte: formattedCurrentDate,
      };
    }

    if (session_type && (session_type == 1 || session_type == 2)) {
      searchQuery["session_type"] = parseInt(session_type);
    }
    if (private_or_group && private_or_group == 1) {
      // class is private
      searchQuery["max_students_allowed"] = 1;
    }
    if (private_or_group && private_or_group == 2) {
      // class is group class
      //searchQuery["max_students_allowed"] = 1;
      searchQuery["max_students_allowed"] = { $gt: 1 };
    }
    if (
      class_level &&
      class_level != "" &&
      class_level > 0 &&
      class_level <= 3
    ) {
      searchQuery["class_level"] = parseInt(class_level);
    }
    if (minimum_price && maximum_price) {
      searchQuery["price"] = {
        $gte: parseInt(minimum_price),
        $lte: parseInt(maximum_price),
      };
    }
    searchQuery["teacherDetail.account_status"] = 1;
    //searchQuery["class_details.session_progress_status"] = 0;

    // var totalRecords = await Classes.aggregate([
    //   [
    //     {
    //       $lookup: {
    //         from: "class_details",
    //         localField: "_id",
    //         foreignField: "class_id",
    //         as: "class_details",
    //       },
    //     },
    //     {
    //       $match: {
    //         $or: [
    //           {
    //             "class_details.class_session_date": {
    //               $gte: dateForTest,
    //             },
    //           },
    //           { type_of_class: 1 },
    //         ],
    //       },
    //     },
    //     {
    //       $match: searchQuery,
    //     },

    //     {
    //       $project: {
    //         _id: 1,
    //       },
    //     },
    //     { $sort: { _id: -1 } },
    //   ],
    // ]);
    var totalRecords = await Classes.aggregate([
      //[
      {
        $lookup: {
          from: "class_details",
          localField: "_id",
          foreignField: "class_id",
          as: "class_details",
        },
      },
      {
        $match: {
          $or: [
            { "class_details.class_session_date": { $gte: dateForTest } },
            { type_of_class: 1 },
          ],
        },
      },
      // {
      //   $match: searchQuery,
      // },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
                last_name: { $ifNull: ["$last_name", ""] },
                profile_image: { $ifNull: ["$profile_image", ""] },
                account_status: { $ifNull: ["$account_status", ""] },
              },
            },
          ],
          as: "teacherDetail",
        },
      },
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: "teachers_ratings",
          localField: "created_by",
          foreignField: "rating_given_to",
          as: "teacherRating",
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
      //],
    ]);
    var data = await Classes.aggregate([
      //[
      {
        $lookup: {
          from: "class_details",
          localField: "_id",
          foreignField: "class_id",
          as: "class_details",
        },
      },
      {
        $match: {
          $or: [
            { "class_details.class_session_date": { $gte: dateForTest } },
            { type_of_class: 1 },
          ],
        },
      },
      // {
      //   $match: searchQuery,
      // },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
                last_name: { $ifNull: ["$last_name", ""] },
                profile_image: { $ifNull: ["$profile_image", ""] },
                account_status: { $ifNull: ["$account_status", ""] },
              },
            },
          ],
          as: "teacherDetail",
        },
      },
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: "teachers_ratings",
          localField: "created_by",
          foreignField: "rating_given_to",
          as: "teacherRating",
        },
      },
      {
        $project: {
          class_title: 1,
          class_level: 1,
          cover_image: 1,
          type_of_class: 1,
          session_type: 1,
          price: 1,
          max_students_allowed: 1,
          enrolled_students: 1,
          location: 1,
          class_details: 1,
          address_or_class_link: {
            $ifNull: ["$address_or_class_link", "Online"],
          },
          teacherDetail: 1,
          totalRating: { $size: "$teacherRating" },
          avgRating: {
            $let: {
              vars: {
                countdata: "$teacherRating",
              },
              in: {
                $cond: {
                  if: { $gt: [{ $size: "$$countdata" }, 0] },
                  then: { $avg: "$teacherRating.rating" },
                  else: 0,
                },
              },
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      //],
    ]);
    return res.json({
      success: true,
      data: {
        totalRecords: totalRecords.length,
        records: data,
      },
      message: "Record fetched successfully",
      searchQuery,
    });
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

// @route    GET api/users/getTopicsAndDiscipline
// @desc     get classes list of auth teacher
// @access   Private
router.get("/getTopicsAndDiscipline", auth, async (req, res) => {
  try {
    const { discipline_or_topic } = req.query;
    var searchQuery = {};
    searchQuery["class_status"] = 1;
    var classData = await Classes.aggregate([
      {
        $lookup: {
          from: "class_details",
          localField: "_id",
          foreignField: "class_id",
          as: "class_details",
        },
      },
      {
        $unwind: "$class_details",
      },
      {
        $match: {
          discipline: { $regex: discipline_or_topic, $options: "i" },
          "class_details.class_session_date": { $gte: new Date() },
        },
      },
      {
        $project: {
          discipline: 1,
        },
      },
    ]);
    var topicsData = await Tags.find(
      {
        tag_status: false,
        tag_name: { $regex: discipline_or_topic, $options: "i" },
      },
      { tag_name: 1 }
    );

    var filteredDiscipline = classData.map(function (detail) {
      return detail.discipline;
    });
    var filteredTopics = topicsData.map(function (detail) {
      return detail.tag_name;
    });
    var filteredResult = filteredDiscipline.concat(filteredTopics);
    if (filteredResult.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: filteredResult,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getAddresses
// @desc     get classes list of auth teacher
// @access   Private
router.get("/getAddresses", auth, async (req, res) => {
  try {
    const { address } = req.query;
    var classData = await Classes.find(
      {
        address_or_class_link: { $regex: address, $options: "i" },
        session_type: 1,
        class_status: 1,
      },
      { address_or_class_link: 1 }
    );
    var filteredAddress = classData.map(function (detail) {
      return detail.address_or_class_link;
    });
    if (filteredAddress.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: filteredAddress,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getPopularTags
// @desc     get classes list of auth teacher
// @access   Private
router.get("/getPopularTags", auth, async (req, res) => {
  try {
    var tags = await Tags.aggregate([
      { $sample: { size: 12 } },
      {
        $match: {
          tag_status: false,
        },
      },
      {
        $project: {
          tag_name: 1,
        },
      },
    ]);
    if (tags.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: tags,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getTeacherPublicProfileForStudent/:teacherId
// @desc     get teacher public profile info
// @access   Private
router.get(
  "/getTeacherPublicProfileForStudent/:teacherId",
  auth,
  async (req, res) => {
    try {
      var userId = req.user.id;
      var data = await User.aggregate([
        {
          $match: {
            _id: ObjectId(req.params.teacherId),
            deleted: 0,
            account_status: 1,
            account_verified: 1,
          },
        },
        {
          $lookup: {
            from: "wishlists",
            localField: "_id",
            foreignField: "teacher_id",
            pipeline: [
              {
                $match: {
                  student_id: ObjectId(userId),
                },
              },
            ],
            as: "isInWishlist",
          },
        },
      ]);

      // return console.log("single user profile id " , userId , data , data[0].isInWishlist.length)
      var userData = data[0];
      var genderData = await Dropdown.findOne({ name: "gender_identity" });
      if (userData) {
        res.json({
          success: true,
          message: "Record fetched successfully.",
          data: {
            user_name: userData.first_name + " " + userData.last_name,
            expertise: userData.expertise,
            street_address: userData.street_address,
            city: userData.city,
            state: userData.state,
            zip_code: userData.zip_code,
            age: userData.age,
            phone: userData.phone,
            gender: genderData ? genderData.options[userData.gender] : "",
            language: userData.language,
            about_me: userData.about_expertise,
            planned_topics: userData.planned_topics,
            profile_image: userData.profile_image,
            intro_video: userData?.intro_video ? userData.intro_video : "",
            isInWishlist: userData?.isInWishlist.length > 0 ? 1 : 0,
          },
        });
      } else {
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "No Record Found",
              param: "token",
              location: "body",
            },
          ],
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
  }
);

// @route    GET api/users/getClassesListForStudent/:teacherId
// @desc     get classes list of auth teacher
// @access   Private
router.get("/getClassesListForStudent/:teacherId", auth, async (req, res) => {
  try {
    var searchQuery = {};
    searchQuery["class_status"] = 1;
    searchQuery["created_by"] = ObjectId(req.params.teacherId);

    //console.log(searchQuery);
    // await Classes.updateMany({
    //   class_status : 0
    // },{
    //   $set: {class_status:1}
    // })
    var classData = await Classes.aggregate([
      {
        $lookup: {
          from: "class_details",
          localField: "_id",
          foreignField: "class_id",
          // pipeline: [
          //   {
          //     $project: {
          //       class_id: { $ifNull: ["$class_id", 0] },
          //     },
          //   },
          // ],
          as: "class_details",
        },
      },
      {
        $match: {
          $or: [
            { "class_details.class_session_date": { $gte: new Date() } },
            { type_of_class: parseInt(1) },
          ],
        },
      },
      { $match: searchQuery },
      {
        $project: {
          discipline: 1,
          class_title: 1,
          price: 1,
          max_students_allowed: 1,
          type_of_class: 1,
          enrolled_students: 1,
        },
      },
    ]);

    // var classDataForOnDemand = await Classes.find(
    //   {
    //     created_by: req.params.teacherId,
    //     class_status: 1,
    //     type_of_class: 1,
    //   },
    //   {
    //     discipline: 1,
    //     class_title: 1,
    //     price: 1,
    //     max_students_allowed: 1,
    //     type_of_class: 1,
    //     enrolled_students: 1,
    //   }
    // );
    var classIds = [];
    var classDetailsObject = [];
    for (var i = 0; i < classData.length; i++) {
      var detail = classData[i];
      if (
        detail.enrolled_students <= detail.max_students_allowed &&
        detail.type_of_class != 1
      ) {
        let id = ObjectId(detail._id).toString();
        console.log(classIds);
        if (classIds.indexOf(id) === -1) {
          classIds.push(id);
          classDetailsObject.push(detail);
        }
      } else if (detail.type_of_class == 1) {
        let id = ObjectId(detail._id).toString();
        console.log(classIds);
        if (classIds.indexOf(id) === -1) {
          classIds.push(id);
          classDetailsObject.push(detail);
        }
      }
    }
    // var classData = await Classes.find(
    //   {
    //     created_by: req.params.teacherId,
    //     $or : [ {class_status : 0}, {class_status : 1} ]
    //   },{
    //     discipline : 1,
    //     class_title : 1,
    //     price : 1,
    //     max_students_allowed : 1
    //   });
    //var filteredResult = classDetailsObject.concat(classDataForOnDemand);
    if (classDetailsObject.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: classDetailsObject,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/getClassDetailForStudent/:teacherId/:class_id
// @desc     get class detail of auth teacher using id
// @access   Private
router.get(
  "/getClassDetailForStudent/:teacherId/:class_id",
  auth,
  async (req, res) => {
    try {
      var class_id = req.params.class_id;
      var created_by = req.params.teacherId;
      var userId = req.user.id;
      if (!class_id) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "class_id parameter is missing",
              param: "params",
              location: "body",
            },
          ],
        });
      }
      var teacher = await User.findOne(
        {
          _id: created_by,
          account_status: 1,
        },
        {
          phone: 1,
          profile_image: 1,
          first_name: 1,
          last_name: 1,
        }
      );
      if (!teacher) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "Teacher account does not exists",
              param: "server",
              location: "body",
            },
          ],
        });
      } else {
        var classExists = await Classes.findOne(
          { _id: class_id, class_status: 1 },
          {
            topics: 0,
            class_detail: 0,
            created_by: 0,
            enrolled_students: 0,
          }
        );

        if (classExists) {
          // var getTheseTags = [];
          //   var selectedTagsCount = classExists.topics.length;
          //   for(var tag=0;tag<selectedTagsCount;tag++){
          //     getTheseTags.push(ObjectId(classExists.topics[tag]));
          //   }
          // var addedTag = await Tags.find({_id:{"$in": getTheseTags}},{tag_name:1});
          var sessionData = [];
          if (
            classExists.type_of_class == 2 ||
            classExists.type_of_class == 3
          ) {
            sessionData = await classDetailsSchema.find({ class_id: class_id, deleted : 0 });
            if (sessionData.length == 0) {
              return res.status(400).send({
                success: false,
                errors: [
                  {
                    msg: "Session not found",
                    param: "server",
                    location: "body",
                  },
                ],
              });
            }
          }
          return res.json({
            success: true,
            message: "Data fetched successfully.",
            data: {
              classData: classExists,
              sessionData: sessionData,
              teacherProfile: teacher,
              addedTag: classExists.topics_text,
            },
          });
        } else {
          return res.status(400).send({
            success: false,
            errors: [
              {
                msg: "Class not found",
                param: "server",
                location: "body",
              },
            ],
          });
        }
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
  }
);

router.get("/featuredTeachers", auth, async (req, res) => {
  try {
    const data = [
      {
        items: [
          {
            _id: "61d43aa35931f2b3a3925a81",
            city: "CA",
            expertise: "React Developer",
            first_name: "Testt1",
            last_name: "Teacher",
            profile_image:
              "https://mymentorbucket.s3.amazonaws.com/IMG_0002.JPG",
            state: "CA",
            street_address: "Boston post road, CA",
            rating: 4,
            rating_total: "88",
          },
          {
            _id: "61d43aa35931f2b3a3925a82",
            city: "CA",
            expertise: "React Developer",
            first_name: "Testt2",
            last_name: "Teacher",
            profile_image:
              "https://mymentorbucket.s3.amazonaws.com/IMG_0002.JPG",
            state: "CA",
            street_address: "Boston post road, CA",
            rating: 4,
            rating_total: "88",
          },
        ],
      },
      {
        items: [
          {
            _id: "61d43aa35931f2b3a3925a83",
            city: "CA",
            expertise: "React Developer",
            first_name: "Testt3",
            last_name: "Teacher",
            profile_image:
              "https://mymentorbucket.s3.amazonaws.com/IMG_0002.JPG",
            state: "CA",
            street_address: "Boston post road, CA",
            rating: 4,
            rating_total: "88",
          },
          {
            _id: "61d43aa35931f2b3a3925a84",
            city: "CA",
            expertise: "React Developer",
            first_name: "Testt4",
            last_name: "Teacher",
            profile_image:
              "https://mymentorbucket.s3.amazonaws.com/IMG_0002.JPG",
            state: "CA",
            street_address: "Boston post road, CA",
            rating: 4,
            rating_total: "88",
          },
        ],
      },
    ];

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: data,
    });
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

// @route    POST api/users/addToWishlist
// @desc     add to wishlist of auth student using id
// @access   Private
router.post(
  "/addToWishlist",
  auth,
  [check("teacher_id", "Teacher Id is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { teacher_id } = req.body;

    try {
      let student_id = req.user.id;
      let recordExists = await Wishlist.findOne({
        teacher_id: teacher_id,
        student_id: student_id,
      });
      if (recordExists) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              response: "error",
              param: "wishlist",
              msg: "Already exists in favourites",
            },
          ],
        });
      }

      var wishlistDetails = {};
      wishlistDetails.teacher_id = teacher_id;
      wishlistDetails.student_id = student_id;
      wishlistDetails.created_at = new Date();

      //await user.save();
      var wishlistData = await Wishlist.findOneAndUpdate(
        { teacher_id: teacher_id, student_id: student_id },
        { $set: wishlistDetails },
        { new: true, upsert: true }
      );
      res.json({
        success: true,
        message: "Teacher added to favourites",
        data: wishlistData,
      });
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
  }
);

// @route    POST api/users/removefrom Wishlist
// @desc     add to wishlist of auth student using id
// @access   Private
router.post(
  "/removefromWishlist",
  auth,
  [check("teacher_id", "Teacher Id is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { teacher_id } = req.body;

    try {
      let student_id = req.user.id;
      await Wishlist.findOneAndRemove({
        teacher_id: teacher_id,
        student_id: student_id,
      });
      res.json({
        success: true,
        message: "Teacher removed from favourites",
      });
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
  }
);

// @route    GET api/users/getWishlistOfStudent
// @desc     get wishlist detail of auth student using id
// @access   Private
router.get("/getWishlistOfStudent", auth, async (req, res) => {
  try {
    var student_id = req.user.id;
    var searchQuery = {};
    searchQuery["users.account_status"] = 1;
    searchQuery["student_id"] = ObjectId(student_id);

    console.log(searchQuery);
    var wishlistExists = await Wishlist.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacher_id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },
      { $match: searchQuery },
      {
        $project: {
          "users.first_name": 1,
          "users.last_name": 1,
          "users.expertise": 1,
          "users.profile_image": 1,
          "users.street_address": 1,
          "users.city": 1,
          "users.state": 1,
          "users._id": 1,
        },
      },
    ]);
    if (wishlistExists.length > 0) {
      return res.json({
        success: true,
        message: "Data fetched successfully.",
        data: wishlistExists,
      });
    } else {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            location: "body",
          },
        ],
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

// @route    DELETE v1/users/deleteTeacherFromWishlist/:id
// @desc     Delete a teacher from wishlist
// @access   Private
router.delete("/deleteTeacherFromWishlist/:id", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !wishlist) {
      return res.status(404).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            location: "body",
          },
        ],
      });
    }

    await wishlist.remove();

    res.json({
      success: true,
      message: "Teacher removed from favourites",
    });
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

// @route    GET api/users/getAvailablilitiesListForStudent
// @desc
// @access   Private
router.get(
  "/getAvailablilitiesListForStudent/:teacher_id",
  auth,
  async (req, res) => {
    try {
      var monthQuery = Number(req.query.month);
      let month = monthQuery.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      var year = req.query.year;
      if (!year || !month) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "year or month query string parameter is missing",
              param: "query string",
              location: "body",
            },
          ],
        });
      }
      var currentDate = new Date();

      var allAvailablility = await Availability.find(
        {
          created_by: req.params.teacher_id,
        },
        { _id: 1, repeat_period: 1, start_date: 1 }
      );

      var DatesArray = [];
      var outputArray = {};
      console.log(allAvailablility);
      function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var startDateUTC = Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        var endDateUTC = Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
      }
      var daysInMonth = new Date(year, month, 0).getDate();
      for (var avail = 0; avail < allAvailablility.length; avail++) {
        for (var days = 1; days <= daysInMonth; days++) {
          let formattedDay = days.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          let dateOfArray = year + "-" + month + "-" + formattedDay;
          var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
          var diffDaysFromCurrentDate = await daysBetween(
            allAvailablility[avail].start_date,
            new Date(dateOfArray)
          );

          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 1
          ) {
            if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 2
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 7 == 0
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 3
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              diffDaysFromCurrentDate % 14 == 0
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            (allAvailablility[avail].repeat_period == 0 ||
              allAvailablility[avail].repeat_period == 4)
          ) {
            if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
          if (
            allAvailablility[avail] &&
            allAvailablility[avail].repeat_period == 5
          ) {
            if (
              diffDays >= 0 &&
              diffDaysFromCurrentDate >= 0 &&
              allAvailablility[avail].month == month &&
              allAvailablility[avail].day == days &&
              year >= currentDate.getFullYear()
            ) {
              if (DatesArray.indexOf(dateOfArray) === -1) {
                DatesArray.push(dateOfArray);
                outputArray[dateOfArray] = { marked: true, selected: true };
              }
            }
          }
        }
      }

      res.json({
        success: true,
        message: "Record fetched successfully",
        data: outputArray,
      });
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
  }
);

router.post(
  "/createInvoice",
  auth,
  [
    check("amount", "Amount is required").matches(/^[0-9.]+$/),
    check("class_id", "Class ID is required").not().isEmpty(),
    check("card_type", "Card type is required (Example : visa)")
      .not()
      .isEmpty(),
    check("card_last_digits", "Card last 4 digits are required")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, class_id, card_type, card_last_digits } = req.body;
    var classData = await Classes.findOne(
      { _id: class_id },
      { class_title: 1 }
    );
    var classDetailData = await classDetailsSchema.find(
      { class_id: class_id },
      { class_date: 1, start_time_of_class: 1 }
    );
    var userData = await User.findOne(
      { _id: req.user.id },
      {
        first_name: 1,
        last_name: 1,
        street_address: 1,
        city: 1,
        state: 1,
        zip_code: 1,
      }
    );

    var theRandomNumber = Math.floor(Math.random() * 1000) + 1;
    var invoice_link = Date.now() + ".pdf";
    const bitmap = fs.readFileSync("./uploads/logo-teachifed.png");
    const logo = bitmap.toString("base64");
    var todayDate = new Date().toISOString().slice(0, 10);
    const data = {
      billing_date: todayDate,
      user_name: userData.first_name + "" + userData.last_name,
      street_address: userData.street_address,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zip_code,
      invoice_id: theRandomNumber,
      class_price: amount,
      logo: logo,
      card_type: card_type,
      card_last_digits: card_last_digits,
      class_title: classData.class_title,
      classDetailData: classDetailData,
    };
    const filePathName = path.resolve(__dirname, "htmltopdf.ejs");
    const htmlString = fs.readFileSync(filePathName).toString();
    let options = { format: "Letter", orientation: "landscape" };
    const ejsData = ejs.render(htmlString, data);

    return await pdf.create(ejsData, options).toStream((err, response) => {
      if (err) return console.log(err);
      return new Promise((ress, rej) => {
        const uploadParams = {
          Bucket: bucketName,
          Key: invoice_link,
          ACL: "public-read-write",
          Body: response,
        };
        s3.upload(uploadParams, (err, data) => {
          if (err) {
            console.log("error", err);
            rej("");
          }
          // const newTransaction = new Transaction({});
          // await newTransaction.save();
          return res.json(data.Location);
        });
      });
    });
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount*100,
    //   currency: 'usd',
    // });

    // const users = await User.findById(req.user.id);
    // const subscription = await Subscription.findById(subscription_id);

    // const transactions = await Transaction.find({user_id:req.user.id});

    // var date = new Date();
    var todayDate = new Date().toISOString().slice(0, 10);
    // date.setDate(date.getDate() + subscription.expiration_days);
    // var exp_date = date.toISOString().slice(0, 10);

    // if(transactions.length == 0){
    //   var plan_start = todayDate;
    //   var plan_expire = exp_date;
    // }else{
    //   var last = await Transaction.findOne({user_id:req.user.id}).sort({'_id':-1}).limit(1);
    //   var todayDate2 = last.plan_end_date;
    //   var plan_start = new Date(todayDate2).toISOString().slice(0, 10);
    //   var expirationDaysOfPlan = Number(subscription.expiration_days)+Number(1);

    //   todayDate2.setDate(todayDate2.getDate() + expirationDaysOfPlan);
    //   var exp_date = todayDate2.toISOString().slice(0, 10);
    //   var plan_expire = exp_date;

    // }
    //  var options = {
    //   format: "A3",
    //   orientation: "portrait",
    //   border: "10mm",
    // };
    // var document = {
    //   html: html,
    //   data: {
    //     billing_date: todayDate,
    //     user_name: 'Rekha',
    //     subscription_title:'Texting class',
    //     invoice_id: theRandomNumber,
    //     user_address:'abc',
    //     user_email: 'rekha.fresco@gmail.com',
    //     user_phone: '9878335667',
    //     subscription_amt: 100,
    //     discount: 2,
    //     discounted_price: 98,
    //     logo: logo

    //   },
    //   // data: {
    //   //   billing_date: todayDate,
    //   //   user_name: users.firstname,
    //   //   subscription_title:subscription.subscripton_title,
    //   //   invoice_id: theRandomNumber,
    //   //   user_address:users.basic_information,
    //   //   user_email: users.email,
    //   //   user_phone: users.phone,
    //   //   subscription_amt: subscription.original_price,
    //   //   discount: subscription.discount,
    //   //   discounted_price: subscription.discounted_price,
    //   //   logo: logo

    //   // },
    //   path: "./uploads/"+invoice_link,
    //   type: "",
    // };

    //   pdf
    //   .create(document, options)
    //   .then((response) => {
    //     return new Promise((res, rej) => {
    //         const uploadParams = {
    //           Bucket: bucketName,
    //           Key: 'questions.pdf',
    //           ACL: 'public-read-write',
    //           Body: response,
    //         };
    //         s3.upload(uploadParams, (err, data) => {
    //           if (err) {
    //               console.log("error", err);
    //             rej('');
    //           }
    //          return data.Location;
    //         });
    //       });
    // });

    // var perValue = subscription.subscription_duration +
    //   (subscription.duration_type == 0 ? 'Life' : (subscription.duration_type == 1 ? " Years" : " Month"));

    //   const newTransaction = new Transaction({
    //     user_id: req.user.id,
    //     subscription_id: subscription_id,
    //     paymentmethod_id: paymentIntent.paymentMethodId,
    //     transaction_id: paymentIntent.id,
    //     value: paymentIntent.amount / 100,
    //     subscription_title: subscription.subscripton_title,
    //     billing_date:new Date().toISOString(),
    //     invoice_id:theRandomNumber,
    //     invoice_link:invoice_link,
    //     card_method:"Stripe",
    //     plan_start_date:plan_start,
    //     plan_end_date: plan_expire,
    //     perValue : perValue
    //   });
    //     const transaction = await newTransaction.save();
    //  console.log(transaction)

    res.send({
      success: true,
      message: "Payment Successful",
      //data: paymentIntent,
    });
  }
);

router.get(
  "/checkClassIsAlreadyBookedOrNot/:booking_date/:class_id",
  auth,
  async (req, res) => {
    const { booking_date, class_id } = req.params;
    var dayData = new Date(booking_date).getDate();
    var monthData = Number(new Date(booking_date).getMonth()) + Number(1);
    var yearData = new Date(booking_date).getFullYear();
    const classData = await Classes.findOne(
      {
        _id: class_id,
      },
      { price: 1, class_date: 1, type_of_class: 1 }
    );
    if (classData.type_of_class == 1) {
      var classDetailData = await BookedClasses.find(
        {
          day_of_class: dayData,
          month_of_class: monthData,
          year_of_class: yearData,
          class_id: class_id,
          booked_by: req.user.id,
          deleted : 0
        },
        {
          _id: 1,
        }
      );
    } else {
      var classDetailData = await BookedClasses.find(
        {
          class_id: class_id,
          booked_by: req.user.id,
          deleted : 0

        },
        {
          _id: 1,
        }
      );
    }

    res.send({
      success: true,
      message: "Record fetched successfully.",
      data: {
        classDetailData,
        classData,
      },
    });
  }
);

router.post(
  "/bookAClass",
  auth,
  [
    check("amount", "Amount is required").matches(/^[0-9.]+$/),
    check("class_id", "Class ID is required").not().isEmpty(),
    check("card_type", "Card type is required (Example : visa)")
      .not()
      .isEmpty(),
    check("card_last_digits", "Card last 4 digits are required")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {
      amount,
      class_id,
      card_type,
      card_last_digits,
      class_date,
      start_time_of_class,
      on_demand_class,
      class_end_time,
    } = req.body;
    var classDetailData = [];
    if (on_demand_class) {
      console.log(class_date);
      console.log(new Date(class_date).getDate());
      var classData = await Classes.findOne(
        { _id: class_id },
        {
          session_duration: 1,
          class_title: 1,
          created_by: 1,
          cover_image: 1,
          type_of_class: 1,
          enrolled_students: 1,
          platform_fee_percentage: 1,
        }
      );
      var dayData = new Date(class_date).getDate();
      var monthData = Number(new Date(class_date).getMonth()) + Number(1);
      var yearData = new Date(class_date).getFullYear();
      var fullDate = yearData + "-" + monthData + "-" + dayData;
      var classDetailsObject = new classDetailsSchema({
        class_title: classData.class_title,
        day_of_class: dayData,
        month_of_class: monthData,
        year_of_class: yearData,
        class_date: class_date,
        class_session_date: new Date(fullDate),
        start_time_of_class: start_time_of_class,
        end_time_of_class: class_end_time,
        class_id: class_id,
        deleted: 0,
        created_by: classData.created_by,
        created_at: new Date(),
      });
      let addedSession = await classDetailsObject.save();
      classDetailData = await classDetailsSchema.find(
        { _id: addedSession._id },
        {
          day_of_class: 1,
          month_of_class: 1,
          year_of_class: 1,
          class_session_date: 1,
          end_time_of_class: 1,
          class_date: 1,
          start_time_of_class: 1,
        }
      );
      var allSessionsIds = classDetailData.map(function (sessiondetail) {
        return sessiondetail._id;
      });
      var newPayout = new Payouts({
        platform_fee_percentage: classData.platform_fee_percentage,
        class_id: class_id,
        session_ids: allSessionsIds,
        class_created_by: classData.created_by,
        payout_start_date: new Date(class_date),
        created_at: new Date(),
        is_payout_detail_exists: false,
        deleted: 0,
      });
      await newPayout.save();
    } else {
      var classData = await Classes.findOne(
        { _id: class_id },
        {
          class_title: 1,
          created_by: 1,
          cover_image: 1,
          type_of_class: 1,
          enrolled_students: 1,
        }
      );
      classDetailData = await classDetailsSchema.find(
        { class_id: class_id },
        {
          day_of_class: 1,
          month_of_class: 1,
          year_of_class: 1,
          class_session_date: 1,
          end_time_of_class: 1,
          class_date: 1,
          start_time_of_class: 1,
        }
      );
    }

    var userData = await User.findOne(
      { _id: req.user.id },
      {
        first_name: 1,
        last_name: 1,
        street_address: 1,
        city: 1,
        state: 1,
        zip_code: 1,
      }
    );

    var theRandomNumber = Math.floor(Math.random() * 1000) + 1;
    var invoice_link = userData.first_name + Date.now() + ".pdf";
    const bitmap = fs.readFileSync("./uploads/logo-teachifed.png");
    const logo = bitmap.toString("base64");
    var todayDate = new Date().toISOString().slice(0, 10);
    var class_title = classData.class_title;
    var cover_image = classData.cover_image;
    console.log("classDetailData", classDetailData);
    const data = {
      billing_date: todayDate,
      user_name: userData.first_name + " " + userData.last_name,
      street_address: userData.street_address,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zip_code,
      invoice_id: theRandomNumber,
      class_price: amount,
      logo: logo,
      card_type: card_type,
      card_last_digits: card_last_digits,
      class_title: class_title,
      classDetailData: classDetailData,
    };
    const filePathName = path.resolve(__dirname, "htmltopdf.ejs");
    const htmlString = fs.readFileSync(filePathName).toString();
    let options = {
      format: "Letter",
      orientation: "landscape",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
      //phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
    };
    const ejsData = ejs.render(htmlString, data);

    await pdf.create(ejsData, options).toStream((err, response) => {
      if (err) return console.log(err);
      new Promise((ress, rej) => {
        const uploadParams = {
          Bucket: bucketName,
          Key: invoice_link,
          ACL: "public-read-write",
          Body: response,
          ContentType: "application/pdf",
        };
        s3.upload(uploadParams, (err, data) => {
          if (err) {
            console.log("error", err);
            rej("");
          }
          // const newTransaction = new Transaction({});
          // await newTransaction.save();
          //console.log(data.Location);
          //return res.json(data.Location);
        });
      });
    });
    //return res.json(bucketUrl+invoice_link);
    var invoice_url = bucketUrl + invoice_link;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      confirm: true,
      payment_method: "pm_card_visa",
      capture_method: "automatic",
    });
    // const paymentIntentCapture = await stripe.paymentIntents.capture(
    //   paymentIntent.id
    // );
    let created_at = new Date();
    let booked_by = req.user.id;
    const newTransaction = new Transaction({
      user_id: booked_by,
      class_id: class_id,
      paymentmethod_id: paymentIntent.paymentMethodId,
      transaction_id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      billing_date: todayDate,
      invoice_id: theRandomNumber,
      invoice_link: invoice_url,
      invoice_data: data,
      payment_status: 0,
      deleted: 0,
      created_at: created_at,
    });
    const transaction = await newTransaction.save();
    var transaction_id = transaction._id;
    var channel_id = transaction._id;
    if (classData.type_of_class != 1) {
      channel_id = class_id;
    }

    //console.log(channelId);
    var mycustomfield = {
      channel_name: class_title,
      cover_image: cover_image,
    };
    const channel = serverClient.channel("messaging", `${channel_id}`, {
      created_by_id: "4645",
      name: class_title,
      image: cover_image,
      mycustomfield: mycustomfield,
    });
    await channel.create();
    await channel.addMembers([classData.created_by, booked_by]);
    await Transaction.findOneAndUpdate(
      { _id: transaction_id },
      { $set: { channel_id: channel_id } }
    );
    var bookedClassesArray = [];
    var sessionsIdsOfBookedClass = [];
    for (var i = 0; i < classDetailData.length; i++) {
      let detail = classDetailData[i];
      sessionsIdsOfBookedClass.push(detail._id);
      bookedClassesArray.push({
        booked_by: booked_by,
        class_id: class_id,
        session_id: detail._id,
        transaction_id: transaction_id,
        created_by: classData.created_by,
        class_title: classData.class_title,
        booking_status: 0,
        day_of_class: detail.day_of_class,
        month_of_class: detail.month_of_class,
        year_of_class: detail.year_of_class,
        class_date: detail.class_date,
        class_session_date: detail.class_session_date,
        start_time_of_class: detail.start_time_of_class,
        end_time_of_class: detail.end_time_of_class,
        session_progress_status: 0,
        deleted : 0,
        created_at: new Date(),
      });
    }
    if (bookedClassesArray.length > 0) {
      await BookedClasses.insertMany(bookedClassesArray);
    }
    let totalEnrolled = 0;
    if (classData.enrolled_students) {
      totalEnrolled = Number(classData.enrolled_students) + 1;
    } else {
      totalEnrolled = 1;
    }
    await Classes.findOneAndUpdate(
      {
        _id: class_id,
      },
      {
        $set: { enrolled_students: totalEnrolled },
      }
    );
    var transactionsHistory = await Transaction.find(
      { channel_id: channel_id },
      {
        user_id: 1,
      }
    );
    var allBookedByUserIds = transactionsHistory.map(function (ids) {
      return ids.user_id;
    });
    var getPreviousPayoutsRecord = await Payouts.findOne({
      class_id: class_id,
      session_ids: sessionsIdsOfBookedClass,
    });
    if (getPreviousPayoutsRecord) {
      var total_amount =
        Number(getPreviousPayoutsRecord.total_amount) +
        Number(transaction.amount);
      var platform_fee =
        total_amount * (getPreviousPayoutsRecord.platform_fee_percentage / 100);
      var earning = total_amount - platform_fee;
      var class_booked_by = allBookedByUserIds;
      await Payouts.findOneAndUpdate(
        { _id: getPreviousPayoutsRecord._id },
        {
          $set: {
            total_amount: total_amount,
            platform_fee: platform_fee,
            earning: earning,
            class_booked_by: class_booked_by,
            updated_at: new Date(),
          },
        }
      );
    }

    ///////////////////////////////
    ////manage notification////////
    //////////////////////////////

    var SendableMessage = `${
      userData.first_name + " " + userData.last_name
    } just booked a new ${classData.class_title}
    session`;
    var SendableTitle = "You have a new scheduled session!";
    const notificationObject = {
      body: SendableMessage,
      title: SendableTitle,
      contents: SendableMessage,
    };
    var result = await Helper.SendNotification(
      [classData.created_by],
      notificationObject,
      config.SESSIONSCHEDULED
    );
    const listingNotification = new Notifications({
      notification_title: SendableTitle,
      notification_msg: SendableMessage,
      action_by: req.user.id,
      notify_to: classData.created_by,
      notification_type: config.NotificationTypeForBooking,
      class_id: class_id,
    });

    await listingNotification.save();
    ///////End save Notification//////////////
    console.log(paymentIntent);
    res.send({
      success: true,
      message: "Payment Successful",
      data: paymentIntent,
    });
  }
);

router.post(
  "/contactATeacher",
  auth,
  [check("teacher_id", "Teacher id is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { teacher_id } = req.body;
    var student_id = req.user.id;

    if (student_id && teacher_id) {
      var dataObject = {};
      dataObject.student_id = student_id;
      dataObject.teacher_id = teacher_id;
      dataObject.blocked_by_student = false;
      dataObject.blocked_by_teacher = false;
      dataObject.delete = 0;
      var checkContactExists = await Contacts.findOne(dataObject);

      if (!checkContactExists) {
        const user_one_data = await User.findOne(
          { _id: teacher_id, account_status: 1 },
          { first_name: 1, profile_image: 1 }
        );
        const user_two_data = await User.findOne(
          { _id: student_id, account_status: 1 },
          { first_name: 1, profile_image: 1 }
        );
        dataObject.created_at = new Date();

        const addUpdateContacts = new Contacts(dataObject);
        var contactInfo = await addUpdateContacts.save();
        var mycustomfield = {};
        mycustomfield[student_id] = {
          first_name: user_one_data.first_name,
          profile_image: user_one_data.profile_image,
        };
        mycustomfield[teacher_id] = {
          first_name: user_two_data.first_name,
          profile_image: user_two_data.profile_image,
        };
        var channel_id = contactInfo._id;
        const channel = serverClient.channel("messaging", `${channel_id}`, {
          created_by_id: "4645",
          mycustomfield: mycustomfield,
        });
        await channel.create();
        await channel.addMembers([student_id, teacher_id]);
        await channel.sendMessage({
          text: `Hi ${user_one_data.first_name}`,
          user_id: student_id,
        });
        return res.send({
          success: true,
          message: "Now you can chat with each other",
          data: addUpdateContacts,
        });
      } else {
        return res.send({
          success: true,
          message: "Loading chat please wait..",
          data: checkContactExists,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        errors: [
          {
            msg: "Something went wrong. Please try after some time.",
          },
        ],
      });
    }
  }
);

router.get(
  "/checkContactExistsWithTeacher/:teacher_id",
  auth,
  async (req, res) => {
    const { teacher_id } = req.params;
    var student_id = req.user.id;

    if (student_id && teacher_id) {
      var dataObject = {};
      dataObject.student_id = student_id;
      dataObject.teacher_id = teacher_id;
      dataObject.delete = 0;
      var checkContactExists = await Contacts.findOne(dataObject);

      if (!checkContactExists) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              msg: "No chat channel found.",
            },
          ],
        });
      } else {
        return res.send({
          success: true,
          message: "Loading chat please wait..",
          data: checkContactExists,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        errors: [
          {
            msg: "Something went wrong. Please try after some time.",
          },
        ],
      });
    }
  }
);

router.post(
  "/blockUnblockChannel",
  auth,
  [
    check("teacher_id", "Teacher id is required").not().isEmpty(),
    check(
      "frozen_channel",
      "Need parameter that you want to block or unblock the account"
    )
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { teacher_id, frozen_channel } = req.body;
    var student_id = req.user.id;

    if (student_id && teacher_id) {
      var dataObject = {};
      dataObject.student_id = student_id;
      dataObject.teacher_id = teacher_id;
      dataObject.deleted = 0;
      var checkContactExists = await Contacts.findOne(dataObject);
      var message = frozen_channel ? "Account Blocked" : "Account Unblocked.";
      if (checkContactExists) {
        var channel_id = checkContactExists._id;
        const channel = serverClient.channel("messaging", `${channel_id}`);
        await channel.update(
          {
            frozen: frozen_channel
              ? frozen_channel
              : checkContactExists.blocked_by_teacher
              ? true
              : frozen_channel,
          },
          { text: message, user_id: student_id }
        );
        await Contacts.findOneAndUpdate(
          { _id: channel_id },
          {
            $set: {
              frozen_channel: frozen_channel
                ? frozen_channel
                : checkContactExists.blocked_by_teacher
                ? true
                : frozen_channel,
              blocked_by_student: frozen_channel,
            },
          }
        );
      }
      return res.send({
        success: true,
        message: message,
      });
    } else {
      return res.status(400).json({
        success: false,
        errors: [
          {
            msg: "Something went wrong. Please try after some time.",
          },
        ],
      });
    }
  }
);

router.post(
  "/blockUnblockChannelForTeacher",
  auth,
  [
    check("student_id", "Student id is required").not().isEmpty(),
    check(
      "frozen_channel",
      "Need parameter that you want to block or unblock the account"
    )
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { student_id, frozen_channel } = req.body;
    var teacher_id = req.user.id;

    if (student_id && teacher_id) {
      var dataObject = {};
      dataObject.student_id = student_id;
      dataObject.teacher_id = teacher_id;
      dataObject.deleted = 0;
      var checkContactExists = await Contacts.findOne(dataObject);
      var message = frozen_channel ? "Account Blocked" : "Account Unblocked.";
      if (checkContactExists) {
        var channel_id = checkContactExists._id;
        const channel = serverClient.channel("messaging", `${channel_id}`);
        await channel.update(
          {
            frozen: frozen_channel
              ? frozen_channel
              : checkContactExists.blocked_by_student
              ? true
              : frozen_channel,
          },
          { text: message, user_id: teacher_id }
        );
        await Contacts.findOneAndUpdate(
          { _id: channel_id },
          {
            $set: {
              frozen_channel: frozen_channel
                ? frozen_channel
                : checkContactExists.blocked_by_student
                ? true
                : frozen_channel,
              blocked_by_teacher: frozen_channel,
            },
          }
        );
      }
      return res.send({
        success: true,
        message: message,
      });
    } else {
      return res.status(400).json({
        success: false,
        errors: [
          {
            msg: "Something went wrong. Please try after some time.",
          },
        ],
      });
    }
  }
);
router.get("/blockUnblockChannelStatus/:channel_id", auth, async (req, res) => {
  const { channel_id } = req.params;
  var checkContactExists = await Contacts.findOne({ _id: channel_id });
  var blockStatusForStudent = false;
  var blockStatusForTeacher = false;
  var showInputField = true;
  if (checkContactExists) {
    if (checkContactExists.frozen_channel) {
      showInputField = false;
    }
    if (checkContactExists.blocked_by_student) {
      blockStatusForStudent = true;
    }
    if (checkContactExists.blocked_by_teacher) {
      blockStatusForTeacher = true;
    }
  }
  return res.send({
    success: true,
    message: "Data fetched successfully.",
    data: {
      blockStatusForStudent: blockStatusForStudent,
      blockStatusForTeacher: blockStatusForTeacher,
      showInputField: showInputField,
    },
  });
});

router.get("/getFrontUserDetail", auth, async (req, res) => {
  var student_id = req.user.id;
  var dataObject = {};
  dataObject.student_id = student_id;
  dataObject.delete = 0;
  var checkContactExists = await Contacts.find(dataObject).populate(
    "teacher_id",
    { first_name: 1, profile_image: 1 }
  );
  res.json({
    success: true,
    data: checkContactExists,
    message: "Record fetched successfully.",
  });
});

router.get("/getFrontUserDetailForTeacher", auth, async (req, res) => {
  var teacher_id = req.user.id;
  var dataObject = {};
  dataObject.teacher_id = teacher_id;
  dataObject.delete = 0;
  var checkContactExists = await Contacts.find(dataObject).populate(
    "student_id",
    { first_name: 1, profile_image: 1 }
  );
  res.json({
    success: true,
    data: checkContactExists,
    message: "Record fetched successfully.",
  });
});
// @route    GET api/users/getAvailablility/:id
// @desc     add availablility
// @access   Private
// router.get(
//   "/getAvailablilityForStudent/:teacherId/:availabilityDate",
//   auth,
//   async (req, res) => {
//     try {
//       var monthQuery = Number(req.query.month);
//       let month = monthQuery.toLocaleString("en-US", {
//         minimumIntegerDigits: 2,
//         useGrouping: false,
//       });
//       var year = req.query.year;

//       var availabilityDate = req.params.availabilityDate;
//       var days = new Date(availabilityDate).getDate();

//       var teacherId = req.params.teacherId;
//       if (!availabilityDate) {
//         return res.status(400).send({
//           success: false,
//           errors: [
//             {
//               msg: "availabilityDate is required",
//               param: "params",
//               location: "body",
//             },
//           ],
//         });
//       }
//       var currentDate = new Date();

//       var allAvailablility = await Availability.find({
//         created_by: teacherId,
//       });
//       const tConvert = (time24) => {
//         const [sHours, sMinutes] = time24
//           .match(/([0-9]{1,2}):([0-9]{1,2})/)
//           .slice(1);
//         const period = +sHours < 12 ? "AM" : "PM";
//         const hours = +sHours % 12 || 12;
//         var updatedMinutes = sMinutes.toLocaleString("en-US", {
//           minimumIntegerDigits: 2,
//           useGrouping: false,
//         });
//         if (updatedMinutes.length == 1) {
//           updatedMinutes = updatedMinutes + "0";
//         }
//         return `${hours}:${updatedMinutes} ${period}`;
//       };
//       // function tConvert(time) {
//       //   // Check correct time format and split into components
//       //   time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [
//       //     time,
//       //   ];

//       //   if (time.length > 1) {
//       //     // If time format correct
//       //     time = time.slice(1); // Remove full string match value
//       //     time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
//       //     time[0] = +time[0] % 12 || 12; // Adjust hours
//       //   }
//       //   return time.join(""); // return adjusted time or original string
//       // }
//       var outputArray = [];
//       function daysBetween(startDate, endDate) {
//         var millisecondsPerDay = 1000 * 60 * 60 * 24;
//         var startDateUTC = Date.UTC(
//           startDate.getFullYear(),
//           startDate.getMonth(),
//           startDate.getDate()
//         );
//         var endDateUTC = Date.UTC(
//           endDate.getFullYear(),
//           endDate.getMonth(),
//           endDate.getDate()
//         );

//         return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
//       }
//       function getMinutes(str) {
//         var time = str.split(":");
//         return time[0] * 60 + time[1] * 1;
//       }
//       function getMinutesNow() {
//         var timeNow = new Date();
//         return timeNow.getHours() * 60 + timeNow.getMinutes();
//       }
//       for (var avail = 0; avail < allAvailablility.length; avail++) {
//         let dateOfArray = availabilityDate;
//         var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
//         var diffDaysFromCurrentDate = await daysBetween(
//           allAvailablility[avail].start_date,
//           new Date(dateOfArray)
//         );
//         var detail = allAvailablility[avail];
//         var booked_slot = "";
//         var checkClassBookedOnThisTimeOrNot = null;
//         var now = getMinutesNow();
//         var start = getMinutes(detail.start_time);
//         var end = getMinutes(detail.end_time);

//         console.log("now", now);
//         console.log(start);
//         console.log(end);
//         console.log("detail.repeat_period", detail.repeat_period);
//         if (detail && detail.repeat_period == 1) {
//           if (diffDays >= 0 && diffDaysFromCurrentDate >= 0) {
//             booked_slot =
//               availabilityDate +
//               " " +
//               detail.start_time +
//               "-" +
//               availabilityDate +
//               " " +
//               detail.end_time;
//             checkClassBookedOnThisTimeOrNot =
//               await ScheduledAvailabilities.findOne(
//                 {
//                   booking_slot: booked_slot,
//                   created_by: teacherId,
//                   booking_status: 0,
//                 },
//                 { _id: 1 }
//               );
//             if (!checkClassBookedOnThisTimeOrNot) {
//               if (now < end && now < start) {
//                 outputArray.push(
//                   tConvert(detail.start_time) +
//                   " to " +
//                   tConvert(detail.end_time)
//                 );
//               }
//             }
//           }
//         }
//         if (detail && detail.repeat_period == 2) {
//           if (
//             diffDays >= 0 &&
//             diffDaysFromCurrentDate >= 0 &&
//             diffDaysFromCurrentDate % 7 == 0
//           ) {
//             booked_slot =
//               availabilityDate +
//               " " +
//               detail.start_time +
//               "-" +
//               availabilityDate +
//               " " +
//               detail.end_time;
//             checkClassBookedOnThisTimeOrNot =
//               await ScheduledAvailabilities.findOne(
//                 {
//                   booking_slot: booked_slot,
//                   created_by: teacherId,
//                   booking_status: 0,
//                 },
//                 { _id: 1 }
//               );
//             if (!checkClassBookedOnThisTimeOrNot) {
//               if (now < end && now < start) {
//                 outputArray.push(
//                   tConvert(detail.start_time) +
//                   " to " +
//                   tConvert(detail.end_time)
//                 );
//               }
//             }
//           }
//         }
//         if (detail && detail.repeat_period == 3) {
//           if (
//             diffDays >= 0 &&
//             diffDaysFromCurrentDate >= 0 &&
//             diffDaysFromCurrentDate % 14 == 0
//           ) {
//             booked_slot =
//               availabilityDate +
//               " " +
//               detail.start_time +
//               "-" +
//               availabilityDate +
//               " " +
//               detail.end_time;
//             checkClassBookedOnThisTimeOrNot =
//               await ScheduledAvailabilities.findOne(
//                 {
//                   booking_slot: booked_slot,
//                   created_by: teacherId,
//                   booking_status: 0,
//                 },
//                 { _id: 1 }
//               );
//             if (!checkClassBookedOnThisTimeOrNot) {
//               if (now < end && now < start) {
//                 outputArray.push(
//                   tConvert(detail.start_time) +
//                   " to " +
//                   tConvert(detail.end_time)
//                 );
//               }
//             }
//           }
//         }
//         if (
//           detail &&
//           (detail.repeat_period == 0 || detail.repeat_period == 4)
//         ) {
//           if (diffDays == 0 && diffDaysFromCurrentDate == 0) {
//             booked_slot =
//               availabilityDate +
//               " " +
//               detail.start_time +
//               "-" +
//               availabilityDate +
//               " " +
//               detail.end_time;
//             checkClassBookedOnThisTimeOrNot =
//               await ScheduledAvailabilities.findOne(
//                 {
//                   booking_slot: booked_slot,
//                   created_by: teacherId,
//                   booking_status: 0,
//                 },
//                 { _id: 1 }
//               );
//             if (!checkClassBookedOnThisTimeOrNot) {
//               if (now < end && now < start) {
//                 outputArray.push(
//                   tConvert(detail.start_time) +
//                   " to " +
//                   tConvert(detail.end_time)
//                 );
//               }
//             }
//           }
//         }
//         if (detail && detail.repeat_period == 5) {
//           if (
//             diffDays >= 0 &&
//             diffDaysFromCurrentDate >= 0 &&
//             detail.month == month &&
//             detail.day == days &&
//             year >= currentDate.getFullYear()
//           ) {
//             booked_slot =
//               availabilityDate +
//               " " +
//               detail.start_time +
//               "-" +
//               availabilityDate +
//               " " +
//               detail.end_time;
//             checkClassBookedOnThisTimeOrNot =
//               await ScheduledAvailabilities.findOne(
//                 {
//                   booking_slot: booked_slot,
//                   created_by: teacherId,
//                   booking_status: 0,
//                 },
//                 { _id: 1 }
//               );
//             if (!checkClassBookedOnThisTimeOrNot) {
//               if (now < end && now < start) {
//                 outputArray.push(
//                   tConvert(detail.start_time) +
//                   " to " +
//                   tConvert(detail.end_time)
//                 );
//               }
//             }
//           }
//         }
//       }

//       res.json({
//         success: true,
//         message: "Record fetch successfully",
//         data: outputArray,
//         allAvailablility
//       });
//     } catch (err) {
//       console.error(err.message);

//       res.status(500).send({
//         success: false,
//         errors: [
//           {
//             msg: "Server error",
//             param: "server",
//             location: "body",
//           },
//         ],
//       });
//     }
//   }
// );

router.get(
  "/getAvailablilityForStudent/:teacherId/:availabilityDate",
  //auth,
  async (req, res) => {
    try {
      var monthQuery = Number(req.query.month);
      var interval = Number(req.query.interval);
      let month = monthQuery.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      var year = req.query.year;
      //days = ('0' + days).slice(-2);
      var availabilityDate = req.params.availabilityDate;
      var days = new Date(availabilityDate).getDate();
      var fullDate = month + "-" + days + "-" + year;
      function daysBetween(startDate, endDate) {
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var startDateUTC = Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        var endDateUTC = Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return Math.floor((endDateUTC - startDateUTC) / millisecondsPerDay);
      }

      function getMinutes(str) {
        var time = str.split(":");
        return time[0] * 60 + time[1] * 1;
      }

      if (!availabilityDate) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "availabilityDate is required",
              param: "params",
              location: "body",
            },
          ],
        });
      }
      const tConvert = (time24) => {
        const [sHours, minutes] = time24
          .match(/([0-9]{1,2}):([0-9]{1,2})/)
          .slice(1);
        const period = +sHours < 12 ? "AM" : "PM";
        const hours = +sHours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
      };
      var currentDate = new Date();
      var outputTimeArray = [];
      var currentMonth = currentDate.getMonth() + 1;
      var formattedCurrentDate = `${currentDate.getFullYear()}-${(
        "0" + currentMonth
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}T00:00:00.000Z`;
      var teacherId = req.params.teacherId;
      var allAvailablility = await Availability.find({
        created_by: teacherId,
      });
      var GetDaysDiff = await daysBetween(
        currentDate,
        new Date(availabilityDate)
      );

      if (GetDaysDiff < 0) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "AvailabilityDate must be greater than today",
              param: "params",
              location: "body",
            },
          ],
        });
      }

      for (var avail = 0; avail < allAvailablility.length; avail++) {
        let dateOfArray = availabilityDate;
        var diffDays = await daysBetween(currentDate, new Date(dateOfArray));
        var diffDaysFromCurrentDate = await daysBetween(
          allAvailablility[avail].start_date,
          new Date(dateOfArray)
        );
        var detail = allAvailablility[avail];
        if (detail && detail.repeat_period == 2) {
          if (
            diffDays >= 0 &&
            diffDaysFromCurrentDate >= 0 &&
            diffDaysFromCurrentDate % 7 == 0
          ) {
            //if (now < end && now < start) {
            if (GetDaysDiff == 0) {
              if (detail.start_time.split(":")[0] > new Date().getHours()) {
                outputTimeArray.push(
                  detail.start_time + " to " + detail.end_time
                );
              }
            } else {
              outputTimeArray.push(
                detail.start_time + " to " + detail.end_time
              );
            }
          }
        }
        if (detail && detail.repeat_period == 3) {
          if (
            diffDays >= 0 &&
            diffDaysFromCurrentDate >= 0 &&
            diffDaysFromCurrentDate % 14 == 0
          ) {
            if (GetDaysDiff == 0) {
              if (detail.start_time.split(":")[0] > new Date().getHours()) {
                outputTimeArray.push(
                  detail.start_time + " to " + detail.end_time
                );
              }
            } else {
              outputTimeArray.push(
                detail.start_time + " to " + detail.end_time
              );
            }
          }
        }
      }
      var allAvailablilityOfNeverType = await Availability.find({
        created_by: teacherId,
        repeat_period: 0,
        month: month,
        year: year,
        day: days,
      });

      var allAvailablilityOfEverydayType = await Availability.find({
        created_by: teacherId,
        repeat_period: 1,
      });
      var everyYearRepeatRecord = await Availability.find({
        created_by: teacherId,
        repeat_period: 5,
        month: parseInt(month),
        day: days,
      });
      var everyMonthRepeatRecord = await Availability.find({
        created_by: teacherId,
        repeat_period: 4,
        day: days,
        start_date: {
          $gte: formattedCurrentDate,
        },
      });
      var combinedArray = allAvailablilityOfNeverType.concat(
        allAvailablilityOfEverydayType,
        everyYearRepeatRecord,
        everyMonthRepeatRecord
      );
      for (var i = 0; i < combinedArray.length; i++) {
        // if (GetDaysDiff == 0) {
        //   if (
        //     combinedArray[i].start_time.split(":")[0] > new Date().getHours()
        //   ) {
        //     outputTimeArray.push(
        //       combinedArray[i].start_time + " to " + combinedArray[i].end_time
        //     );
        //   }
        // } else {
        outputTimeArray.push(
          combinedArray[i].start_time + " to " + combinedArray[i].end_time
        );
        //}
      }

      var getAllUpcomingClasses = await classDetailsSchema.find(
        {
          day_of_class: days,
          month_of_class: month,
          year: year,
          created_by: teacherId,
        },
        {
          class_date: 1,
          end_time_of_class: 1,
          start_time_of_class: 1,
        }
      );

      function addMinutes(time, minutes) {
        var date = new Date(
          new Date(`${availabilityDate} ` + time).getTime() + minutes * 60000
        );
        var tempTime =
          (date.getHours().toString().length == 1
            ? "0" + date.getHours()
            : date.getHours()) +
          ":" +
          (date.getMinutes().toString().length == 1
            ? "0" + date.getMinutes()
            : date.getMinutes()) +
          ":" +
          (date.getSeconds().toString().length == 1
            ? "0" + date.getSeconds()
            : date.getSeconds());
        return tempTime;
      }
      function minusMinutes(time, minutes) {
        var dateForMinus = new Date(
          new Date(`${availabilityDate} ` + time).getTime() - minutes * 60000
        );

        var tempTimeMinus =
          (dateForMinus.getHours().toString().length == 1
            ? "0" + dateForMinus.getHours()
            : dateForMinus.getHours()) +
          ":" +
          (dateForMinus.getMinutes().toString().length == 1
            ? "0" + dateForMinus.getMinutes()
            : dateForMinus.getMinutes()) +
          ":" +
          (dateForMinus.getSeconds().toString().length == 1
            ? "0" + dateForMinus.getSeconds()
            : dateForMinus.getSeconds());
        return tempTimeMinus;
      }
      var timeslots = [];
      var timeslotsWithStartAndEndProcess = [];
      outputTimeArray.sort();
      for (
        var timeIntervalDivision = 0;
        timeIntervalDivision < outputTimeArray.length;
        timeIntervalDivision++
      ) {
        if (
          endtime !=
          outputTimeArray[timeIntervalDivision].split(" to ")[0] + ":00"
        ) {
          var starttime =
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[0]
                .split(":")[0]
            ).slice(-2) +
            ":" +
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[0]
                .split(":")[1]
            ).slice(-2) +
            ":00";
          var endtime =
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[1]
                .split(":")[0]
            ).slice(-2) +
            ":" +
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[1]
                .split(":")[1]
            ).slice(-2) +
            ":00";
          //var starttime = "06:30:00";
          // var endtime = "11:30:00";
          var intervalEnd = starttime;
        } else {
          console.log("Continues time");
          starttime = intervalEnd;
          endtime =
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[1]
                .split(":")[0]
            ).slice(-2) +
            ":" +
            (
              "0" +
              outputTimeArray[timeIntervalDivision]
                .split(" to ")[1]
                .split(":")[1]
            ).slice(-2) +
            ":00";
        }
        var limit = minusMinutes(endtime, interval);

        console.log(limit);
        while (starttime <= endtime && starttime <= limit) {
          console.log("I am in while");
          intervalEnd = starttime;
          starttime = addMinutes(starttime, interval);
          if (
            starttime <= endtime &&
            //starttime <= limit &&
            timeslots.indexOf(
              tConvert(intervalEnd) + " to " + tConvert(starttime)
            ) == -1
          ) {
            timeslots.push(
              tConvert(intervalEnd) + " to " + tConvert(starttime)
            );
            timeslotsWithStartAndEndProcess.push(
              intervalEnd + " to " + starttime
            );
          }
        }
      }

      for (
        var comingClasses = 0;
        comingClasses < timeslotsWithStartAndEndProcess.length;
        comingClasses++
      ) {
        if (getAllUpcomingClasses.length > 0) {
          console.log("classes exists on this date");
          for (var i = 0; i < getAllUpcomingClasses.length; i++) {
            var endTimeEnterByUser = getMinutes(
              timeslotsWithStartAndEndProcess[comingClasses].split(" to ")[1]
            );
            var endTimeInRecords = getMinutes(
              getAllUpcomingClasses[i].end_time_of_class
            );
            var startEnterByUser = getMinutes(
              timeslotsWithStartAndEndProcess[comingClasses].split(" to ")[0]
            );
            var startTimeInRecords = getMinutes(
              getAllUpcomingClasses[i].start_time_of_class
            );

            if (
              endTimeEnterByUser == endTimeInRecords &&
              startEnterByUser == startTimeInRecords
            ) {
              var index = timeslots.indexOf(
                tConvert(
                  timeslotsWithStartAndEndProcess[comingClasses].split(
                    " to "
                  )[0]
                ) +
                  " to " +
                  tConvert(
                    timeslotsWithStartAndEndProcess[comingClasses].split(
                      " to "
                    )[1]
                  )
              );
              timeslots.splice(index, 1);
            } else if (
              (startTimeInRecords < startEnterByUser &&
                startEnterByUser < endTimeInRecords) ||
              (startTimeInRecords < endTimeEnterByUser &&
                endTimeEnterByUser < endTimeInRecords) ||
              (startEnterByUser < startTimeInRecords &&
                startTimeInRecords < endTimeEnterByUser) ||
              (startEnterByUser < endTimeInRecords &&
                endTimeInRecords < endTimeEnterByUser)
            ) {
              var index = timeslots.indexOf(
                tConvert(
                  timeslotsWithStartAndEndProcess[comingClasses].split(
                    " to "
                  )[0]
                ) +
                  " to " +
                  tConvert(
                    timeslotsWithStartAndEndProcess[comingClasses].split(
                      " to "
                    )[1]
                  )
              );
              timeslots.splice(index, 1);
            }
          }
        }
      }

      res.json({
        success: true,
        message: "Record fetch successfully",
        data: timeslots,
        previousData: outputTimeArray,
      });
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
  }
);

router.get("/getChatToken", auth, async (req, res) => {
  try {
    var user_id = req.user.id;
    const user = await User.findOne(
      { _id: user_id, deleted: 0 },
      { first_name: 1, profile_image: 1 }
    );
    if (!user) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            param: "token",
            location: "body",
          },
        ],
      });
    }
    await serverClient.upsertUsers([
      {
        id: user_id,
        role: "admin",
        mycustomfield: "Teachify",
      },
    ]);
    const chatToken = serverClient.createToken(user_id);

    res.json({
      success: true,
      message: "Record fetch successfully",
      data: { user, chatToken },
    });
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

router.get("/getChatTokenForAdmin/:id", auth, async (req, res) => {
  try {
    var user_id = req.params.id;
    const user = await User.findOne(
      { _id: user_id, deleted: 0 },
      { first_name: 1, profile_image: 1 }
    );
    if (!user) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            param: "token",
            location: "body",
          },
        ],
      });
    }
    await serverClient.upsertUsers([
      {
        id: user_id,
        role: "admin",
        mycustomfield: "Teachify",
      },
    ]);

    const chatToken = serverClient.createToken(user_id);

    res.json({
      success: true,
      message: "Record fetch successfully",
      data: { user, chatToken },
    });
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

// @route    GET /transaction_history
// @desc     Get transaction history
// @access   Public
router.get("/transactionHistory", [auth], async (req, res) => {
  try {
    const transactions = await Transaction.find(
      {
        user_id: req.user.id,
        deleted: 0,
      },
      {
        "invoice_data.logo": 0,
      }
    );
    if (transactions.length == 0) {
      return res.status(404).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            param: "id",
            location: "params",
          },
        ],
      });
    }
    res.json({
      success: true,
      message: "Record fetch successfully",
      data: transactions,
    });
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

router.get("/invoice/:id", auth, async (req, res) => {
  try {
    var transactionsData = await Transaction.findOne(
      {
        _id: req.params.id,
        user_id: req.user.id,
        // deleted: 0,
      },
      {
        "invoice_data.logo": 0,
      }
    );
    if (!transactionsData) {
      res.json({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "invoice",
            location: "body",
          },
        ],
      });
    }
    res.json({
      success: true,
      message: "Data fetch successfully",
      data: transactionsData,
    });
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

// @route    GET api/users/getSessionsOfSelectedMonthForStudent
// @desc     get records of sessions of selected month (classes)
// @access   Private
router.get("/getSessionsOfSelectedMonthForStudent", auth, async (req, res) => {
  try {
    var month = req.query.month;
    var year = req.query.year;
    if (!year || !month) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "year or month query string parameter is missing",
            param: "query string",
            location: "body",
          },
        ],
      });
    }
    var result = await BookedClasses.find({
      month_of_class: month,
      year_of_class: year,
      booked_by: req.user.id,
      deleted : 0
    });
    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: result,
    });
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

// @route    PUT api/users/updateClassSessionStatus/:sessionID
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => cancel
// @access   Private
router.put("/updateClassSessionStatus/:sessionID", auth, async (req, res) => {
  try {
    const { session_progress_status } = req.body;
    var sessionID = req.params.sessionID;
    let user = await User.findOne({ _id: req.user.id }, { user_role: 1 });
    if (user.user_role == 1) {
      var result = await BookedClasses.findOneAndUpdate(
        { session_id: sessionID },
        { $set: { session_progress_status: session_progress_status } }
      );
      var attendedRecords = await classDetailsSchema
        .findOne({ _id: sessionID }, { created_by: 1 })
        .populate("created_by");
    } else if (user.user_role == 2) {
      var result = await classDetailsSchema.findOneAndUpdate(
        { _id: sessionID },
        { $set: { session_progress_status: session_progress_status } }
      );
      var attendedRecords = await BookedClasses.find(
        { session_id: sessionID },
        { booked_by: 1 }
      ).populate("booked_by");

      //console.log(attendedStudents);
      // for(var i=0;i<attendedStudents.length;i++){

      //   var attendedUsersObject = {
      //     booking_id: attendedStudents[i]._id,
      //     user_id:attendedStudents[i].booked_by,
      //   }
      // }
      // var attendedUsersArray = attendedStudents.map(function(detail) {return {

      // };});
    }
    var message = "";
    if (session_progress_status == 1) {
      message = "Session Started.";
    } else if (session_progress_status == 2) {
      message = "Session Ended.";
    }

    res.json({
      success: true,
      message: message,
      data: attendedRecords,
    });
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

// @route    POST api/users/startSessionByStudent
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => end , 3 => cancel
// @access   Private
// router.post("/startSessionByStudent", auth, async (req, res) => {
//   try {
//     var bookingID = req.body.booking_id;
//     var message = "Session Started.";
//     var result = await BookedClasses.findOneAndUpdate(
//       { _id: bookingID },
//       { $set: { session_progress_status: 1 } }
//     );
//     const channelName = result.session_id;
//     const uid = 0;
//     const role = RtcRole.PUBLISHER;

//     const expirationTimeInSeconds = 36000;
//     const currentTimestamp = Math.floor(Date.now() / 1000);

//     const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//     // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

//     // Build token with uid
//     const token = RtcTokenBuilder.buildTokenWithUid(
//       appID,
//       appCertificate,
//       channelName,
//       uid,
//       role,
//       privilegeExpiredTs
//     );
//     res.json({
//       success: true,
//       message: message,
//       data: {
//         agora_token: token,
//         channel_name: channelName,
//         app_id: appID,
//       },
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({
//       success: false,
//       errors: [
//         {
//           msg: "Server error",
//           param: "server",
//           location: "body",
//         },
//       ],
//     });
//   }
// });
router.post("/startSessionByStudent", auth, async (req, res) => {
  try {
    var session_id = req.body.session_id;
    var booking_id = req.body.booking_id;
    await BookedClasses.findOneAndUpdate(
      { _id: booking_id, booked_by: req.user.id, session_id: session_id },
      { $set: { session_progress_status: 1 } }
    );
    const channelName = session_id;
    //const channelName = 'main';

    const uid = 0;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 36000;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    // return console.log("Booked Class Details" , studentWhoBookTheClass)

    res.json({
      success: true,
      message: "Session started.",
      data: {
        agora_token: token,
        channel_name: channelName,
        app_id: appID,
      },
    });
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
// @route    POST api/users/endSessionByStudent
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => end , 3 => cancel
// @access   Private
router.post("/endSessionByStudent", auth, async (req, res) => {
  try {
    var bookingID = req.body.booking_id;

    var result = await BookedClasses.findOneAndUpdate(
      { _id: bookingID },
      { $set: { session_progress_status: 2 } }
    );
    var attendedRecords = await classDetailsSchema
      .findOne({ _id: result.session_id }, { created_by: 1, class_id: 1 })
      .populate("created_by");
    var message = "Session Ended.";

    res.json({
      success: true,
      message: message,
      data: attendedRecords,
    });
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

// @route    POST api/users/startSessionByTeacher
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => end , 3 => cancel
// @access   Private
router.post("/startSessionByTeacher", auth, async (req, res) => {
  try {
    var session_id = req.body.session_id;
    // var currentStateOfSession = await classDetailsSchema.findOne({
    //   _id: session_id,
    // });
    // console.log(currentStateOfSession);
    var result = await classDetailsSchema.findOneAndUpdate(
      { _id: session_id },
      { $set: { session_progress_status: 1 } }
    );
    // var attendedRecords = await classDetailsSchema.findOne({_id:sessionID},{created_by:1}).
    // populate('created_by');
    const channelName = session_id;
    //const channelName = 'main';

    const uid = 0;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 36000;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    // console.log("Token With Integer Number Uid: " + token);
    // console.log(session_id);
    var message = "Session Started.";

    var attendedRecords = await BookedClasses.find(
      { session_id: session_id },
      { booked_by: 1 }
    );

    //Send notification to those students who booked class
    // console.log(attendedRecords)
    var studentWhoBookTheClass = [];
    // var teacherIdWhoCreateClass = "";
    // if (attendedRecords[0]) {
    //   teacherIdWhoCreateClass = attendedRecords[0].created_by;
    // }
    attendedRecords.map((data) => {
      studentWhoBookTheClass.push(data.booked_by);
    });
    if (studentWhoBookTheClass.length > 0) {
      //Send the notifications to students
      ///////////////////////////////
      ////manage notification////////
      //////////////////////////////
      var getClassName = await classDetailsSchema.findOne({ _id: session_id });
      var SendableMessage = `Your ${getClassName.class_title} class has started. Please join`;
      var SendableTitle = "Class started";
      const notificationObject = {
        body: SendableMessage,
        title: SendableTitle,
        contents: SendableMessage,
      };

      for (let i = 0; i < studentWhoBookTheClass.length; i++) {
        var result = await Helper.SendNotification(
          [attendedRecords[i]._id],
          notificationObject
        );
        const listingNotification = new Notifications({
          notification_title: SendableTitle,
          notification_msg: SendableMessage,
          action_by: req.user.id,
          notify_to: studentWhoBookTheClass[i],
          class_id: attendedRecords[i]._id,
          notification_type: config.NotificationTypeForSessionStart,
        });
        var saveNotification = await listingNotification.save();
      }
      ///////End save Notification//////////
    }
    // return console.log("Booked Class Details" , studentWhoBookTheClass)

    res.json({
      success: true,
      message: "Session started.",
      data: {
        agora_token: token,
        channel_name: channelName,
        app_id: appID,
      },
    });
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

// @route    POST api/users/endSessionByTeacher
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => end , 3 => cancel
// @access   Private
router.post("/endSessionByTeacher", auth, async (req, res) => {
  try {
    var session_id = req.body.session_id;
    var result = await classDetailsSchema.findOneAndUpdate(
      { _id: session_id },
      { $set: { session_progress_status: 2 } }
    );
    var attendedRecords = await BookedClasses.find(
      { session_id: session_id },
      { booked_by: 1 }
    ).populate("booked_by");
    console.log(attendedRecords);
    var message = "Session Ended.";
    // var attendedRecordsNotification = attendedRecords.map(function (detail) {
    //   return {
    //     notification_title: NotificationTypeFourTitle,
    //     notification_type: 4,
    //     read_status: 0,
    //     deleted: 0,
    //     //user_id:req.user.id,
    //     session_id: session_id,
    //     notification_for: detail.booked_by._id,
    //     created_at: new Date(),
    //   };
    // });
    // attendedRecordsNotification.push({
    //   notification_title: NotificationTypeFourTitle,
    //   notification_type: 4,
    //   read_status: 0,
    //   deleted: 0,
    //   //user_id:req.user.id,
    //   session_id: session_id,
    //   notification_for: req.user.id,
    //   created_at: new Date(),
    // });
    // if (attendedRecordsNotification.length > 0) {
    //   await Notifications.insertMany(attendedRecordsNotification);
    // }
    res.json({
      success: true,
      message: message,
      data: attendedRecords,
    });
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

// @route    POST api/users/cancelSession
// @desc     update session_progress_status = 0 => pending, 1 => hosted or attended, 2 => cancel
// @access   Private
router.post(
  "/cancelSession",
  auth,
  [
    check("booking_id", "Booking id is  required").not().isEmpty(),
    check("reason", "Reason is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      var bookingID = req.body.booking_id;
      var reason = req.body.reason;

      var result = await BookedClasses.findOneAndUpdate(
        { _id: bookingID },
        { $set: { session_progress_status: 3 } }
      );
      var dataForNotification = await BookedClasses.findOne({ _id: bookingID })
        .populate("booked_by", { first_name: 1 })
        .populate("class_id", { class_title: 1 });
      let classEnrolledStudents = await Classes.findOne(
        { _id: result.class_id },
        { enrolled_students: 1 }
      );
      let enrolled_students = classEnrolledStudents.enrolled_students - 1;
      await Classes.findOneAndUpdate(
        { _id: result.class_id },
        { $set: { enrolled_students: enrolled_students } }
      );

      await CancelClass.findOneAndUpdate(
        {
          cancelled_by: req.user.id,
          session_id: result.class_id,
        },
        {
          $set: {
            cancelled_by: req.user.id,
            paid_to: req.user.id,
            session_id: result.class_id,
            reason: reason,
            created_at: new Date(),
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      const tConvert = (time24) => {
        const [sHours, minutes] = time24
          .match(/([0-9]{1,2}):([0-9]{1,2})/)
          .slice(1);
        const period = +sHours < 12 ? "AM" : "PM";
        const hours = +sHours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
      };
      var SendableTitle = "Session cancelled.";
      var SendableMessage = `We are sorry, ${
        dataForNotification?.booked_by?.first_name
      } have just canceled the ${
        dataForNotification?.class_id?.class_title
      } session scheduled for ${dataForNotification.class_date} at ${tConvert(
        dataForNotification.start_time_of_class
      )} to ${tConvert(dataForNotification.end_time_of_class)}.`;
      const userObj = {
        title: SendableTitle,
        body: SendableMessage,
        contents: SendableMessage,
      };
      await Helper.SendNotification(
        [dataForNotification.created_by],
        userObj,
        config.SESSIONCANCELLEDFORTEACHER
      );
      // console.log("check the respose " , studentObjRes)
      const listingNotification = new Notifications({
        notification_title: SendableTitle,
        notification_msg: SendableMessage,
        action_by: dataForNotification?.booked_by._id,
        notify_to: dataForNotification.created_by,
        class_id: dataForNotification?.session_id,
        notification_type: config.NotificationTypeForCancelClassByStudent,
      });

      await listingNotification.save();
      var message = "Session Cancelled.";
      res.json({
        success: true,
        message: message,
        //data:attendedRecords
      });
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
  }
);

// @route    POST api/users/cancelSessionTeaher
// @desc     update the class session by teacher
// @access   Private
router.put(
  "/cancelSessionByTeaher",
  auth,
  [
    check("session_id", "Session id is  required").not().isEmpty(),
    check("reason", "Reason is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      const tConvert = (time24) => {
        const [sHours, minutes] = time24
          .match(/([0-9]{1,2}):([0-9]{1,2})/)
          .slice(1);
        const period = +sHours < 12 ? "AM" : "PM";
        const hours = +sHours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
      };
      var sessionId = req.body.session_id;
      var reason = req.body.reason;
      await classDetailsSchema.updateMany(
        {
          _id: sessionId,
        },
        {
          $set: {
            session_progress_status: 3,
          },
        }
      );
      await BookedClasses.updateMany(
        {
          session_id: sessionId,
        },
        {
          $set: {
            session_progress_status: 3,
          },
        }
      );

      var studentList = await BookedClasses.find({
        session_id: sessionId,
      })
        .populate("booked_by", { first_name: 1 })
        .populate("created_by", { first_name: 1 });
      // kamal has cancelled your nodejs session.
      for (let i = 0; i < studentList.length; i++) {
        var SendableTitle = "Session cancelled.";
        var SendableMessage = `We are sorry. The ${
          studentList[i].class_title
        } session scheduled for ${studentList[i].class_date} at ${tConvert(
          studentList[i].start_time_of_class
        )} to ${tConvert(
          studentList[i].end_time_of_class
        )} was canceled. You will be fully refunded for your class soon.`;
        const userObj = {
          title: SendableTitle,
          body: SendableMessage,
          contents: SendableMessage,
        };
        var studentObjRes = await Helper.SendNotification(
          [studentList[i].booked_by._id],
          userObj,
          config.SESSIONCANCELLEDFORSTUDENT
        );
        // console.log("check the respose " , studentObjRes)
        const listingNotification = new Notifications({
          notification_title: SendableTitle,
          notification_msg: SendableMessage,
          action_by: studentList[i].created_by._id,
          notify_to: studentList[i].booked_by._id,
          class_id: studentList[i]._id,
          notification_type: config.NotificationTypeForCancelClassByTeacher,
        });

        var saveNotification = await listingNotification.save();
        //for paybackoff
        await CancelClass.findOneAndUpdate(
          {
            cancelled_by: req.user.id,
            session_id: studentList[i].session_id,
            paid_to: studentList[i].booked_by._id,
          },
          {
            $set: {
              cancelled_by: req.user.id,
              paid_to: studentList[i].booked_by._id,
              session_id: studentList[i].session_id,
              reason: reason,
              created_at: new Date(),
            },
          },
          {
            new: true,
            upsert: true,
          }
        );
      }
      var message = "Session cancelled successfully.";

      res.json({
        success: true,
        message: message,
        studentList,
      });
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
  }
);

// @route    POST v1/users/addRating
// @desc     add rating
// @access   Private
router.post(
  "/addRating",
  auth,
  [
    check("rating", "Rating is required").not().isEmpty(),
    check("user_role", "User role is required").not().isEmpty(),
    check("rating_given_to", "rating_given_to  is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      rating_given_to,
      class_id,
      session_id,
      booking_id,
      rating,
      feedback,
      user_role,
    } = req.body;

    try {
      //let user = await User.findOne({ _id: req.user.id }, { user_role: 1 });
      if (user_role == 1) {
        var ratingObject = {};
        ratingObject.rating_given_to = rating_given_to;
        ratingObject.user_id = req.user.id;
        ratingObject.class_id = class_id;
        ratingObject.session_id = session_id;
        ratingObject.rating = rating;
        ratingObject.feedback = feedback;
        const newRating = new TeachersRating(ratingObject);
        await newRating.save();
        await classDetailsSchema.findOneAndUpdate(
          { _id: session_id },
          { $set: { session_progress_status: 2 } }
        );
      } else if (user_role == 2) {
        var ratingObject = {};
        ratingObject.rating = rating;
        ratingObject.feedback = feedback;
        ratingObject.session_progress_status = 2;
        ratingObject.rating_given_at = new Date();
        var result = await BookedClasses.findOneAndUpdate(
          { _id: booking_id },
          { $set: ratingObject }
        );
      }

      res.json({
        success: true,
        message: "Rating added successfully",
        //data:createdClass
      });
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
  }
);

// @route    Get v1/users/addRating
// @desc     for shwo the no
// @access   Private
router.get("/showNotifications", auth, async (req, res) => {
  try {
    const { page } = req.query;
    var pageNumber = 1;
    if (page) {
      pageNumber = page;
    }
    var limit = 10;
    var skip = (pageNumber - 1) * limit;
    var totalResults = await Notifications.aggregate([
      {
        $match: {
          notify_to: ObjectId(req.user.id),
          deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    var result = await Notifications.aggregate([
      {
        $match: {
          notify_to: ObjectId(req.user.id),
          deleted: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "notify_to",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
                last_name: { $ifNull: ["$last_name", ""] },
                profile_image: { $ifNull: ["$profile_image", ""] },
              },
            },
          ],
          as: "notify_to",
        },
      },
      {
        $unwind: "$notify_to",
      },

      {
        $lookup: {
          from: "users",
          localField: "action_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
                last_name: { $ifNull: ["$last_name", ""] },
                profile_image: { $ifNull: ["$profile_image", ""] },
              },
            },
          ],
          as: "action_by",
        },
      },
      {
        $unwind: "$action_by",
      },
      {
        $lookup: {
          from: "class_details",
          localField: "class_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                class_title: { $ifNull: ["$class_title", ""] },
                class_id: 1,
              },
            },
          ],
          as: "class_details",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                class_title: { $ifNull: ["$class_title", ""] },
              },
            },
          ],
          as: "classes",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "class_id",
          foreignField: "_id",
          // pipeline: [
          //   {
          //     $project: {
          //       class_title: { $ifNull: ["$class_title", ""] },
          //     },
          //   },
          // ],
          as: "transactions",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "transactions.class_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                class_title: { $ifNull: ["$class_title", ""] },
              },
            },
          ],
          as: "transaction_class",
        },
      },
      {
        $lookup: {
          from: "booked_classes",
          localField: "class_id",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "class_details",
                localField: "session_id",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      class_title: { $ifNull: ["$class_title", ""] },
                      class_id: 1,
                    },
                  },
                ],
                as: "class_detail_of_booking",
              },
            },
            {
              $unwind: "$class_detail_of_booking",
            },
            {
              $project: {
                _id: 1,
                class_detail_of_booking: 1,
              },
            },
          ],
          as: "booked_classes",
        },
      },
      // {
      //   $addFields: {
      //     class_or_session: {
      //       $cond: {
      //         if: { $eq: [{ $size: ["$classes"] }, 0] },
      //         then: "$class_details",
      //         else: "$classes"
      //       },
      //     },
      //   },
      // },
      {
        $addFields: {
          class_detail: {
            $cond: {
              if: { $eq: [{ $size: ["$classes"] }, 0] },
              then: {
                $cond: {
                  if: { $eq: [{ $size: ["$class_details"] }, 0] },
                  then: {
                    $cond: {
                      if: { $eq: [{ $size: ["$transaction_class"] }, 0] },
                      then: "$booked_classes",
                      else: "$transaction_class",
                    },
                  },
                  else: "$class_details",
                },
              },
              else: "$classes",
            },
          },
        },
      },
      {
        $unwind: "$class_detail",
      },
      { $sort: { _id: -1, created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          items: {
            $push: "$$ROOT",
          },
          //studentsEnrolled: { $sum: "$classes.enrolled_students" },
        },
      },
      { $sort: { _id: -1, "items.created_at": -1 } },
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: {
        result: result,
        totalRecords: totalResults.length,
      },
    });
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

// @route    Get v1/users/deleteNotifications
// @desc     deleteNotifications
// @access   Private
router.get("/deleteNotifications", auth, async (req, res) => {
  try {
    let notifications = await Notifications.updateMany(
      {
        notify_to: req.user.id,
        deleted: 0,
      },
      {
        $set: { deleted: 1 },
      }
    );
    res.json({
      success: true,
      message: "Record deleted successfully",
      data: notifications,
    });
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

// @route    Get v1/users/notificationMarkAsRead
// @desc     notificationMarkAsRead
// @access   Private
router.get("/notificationMarkAsRead", auth, async (req, res) => {
  try {
    let notifications = await Notifications.updateMany(
      {
        notify_to: req.user.id,
        read_status: 0,
        deleted: 0,
      },
      {
        $set: { read_status: 1 },
      }
    );
    res.json({
      success: true,
      message: "Record updated successfully",
      data: notifications,
    });
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

// @route    Get v1/users/unreadNotificationsCount
// @desc     unreadNotificationsCount
// @access   Private
router.get("/unreadNotificationsCount", auth, async (req, res) => {
  try {
    let notifications = await Notifications.find(
      {
        notify_to: req.user.id,
        read_status: 0,
        deleted: 0,
      },
      { _id: 1 }
    );
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: notifications.length,
    });
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

// @route    GET v1/users/showRating
// @desc     show rating
// @access   Private
router.get("/showRating", auth, async (req, res) => {
  try {
    const { student_id } = req.query;
    var booked_by = req.user.id;

    if (student_id) {
      booked_by = student_id;
    }
    var result = await BookedClasses.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },
      {
        $match: {
          booked_by: ObjectId(booked_by),
          rating: { $gt: 0 },
        },
      },
      {
        $project: {
          rating: 1,
          feedback: 1,
          created_by: 1,
          "users.first_name": 1,
          "users.last_name": 1,
          "users.profile_image": 1,
        },
      },
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: result,
    });
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

// @route    GET v1/users/getNotificationOnOffStatus
// @desc     show getNotificationOnOffStatus
// @access   Private
router.get("/getNotificationOnOffStatus", auth, async (req, res) => {
  try {
    // console.log(config.SESSIONREMINDERFORSTUDENT)
    var data = await NotificationsSettings.aggregate([
      //[
      {
        $lookup: {
          from: "notification_setting_records",
          localField: "_id",
          foreignField: "notification_id",
          as: "notification_setting_records",
        },
      },
      {
        $match: {
          "notification_setting_records.user_id": ObjectId(req.user.id),
          notification_unique_id: config.SESSIONREMINDERFORSTUDENT,
          "notification_setting_records.activation_status": true,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
      { $sort: { _id: -1 } },
      //],
    ]);
    if (data.length != 0) {
      res.json({
        success: true,
        message: "Enable the notification",
        data: data,
      });
    } else {
      res.json({
        success: true,
        message: "Do not send the notification",
        data: data,
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

// @route    GET v1/users/getPayoutsRecords
// @desc     show payouts
// @access   Private
router.get("/getPayoutsRecords", auth, async (req, res) => {
  try {
    const commissionAmount = await Commission.findOne();
    var searchQuery = {};
    searchQuery["$or"] = [
      { "class_details.session_progress_status": 1 },
      { "class_details.session_progress_status": 2 },
    ];
    searchQuery["enrolled_students"] = {
      $gt: 0,
    };
    searchQuery["type_of_class"] = {
      $gt: 1,
    };

    var data = await Classes.aggregate([
      //[
      {
        $lookup: {
          from: "class_details",
          localField: "_id",
          foreignField: "class_id",
          as: "class_details",
        },
      },
      {
        $match: {
          $or: [
            { "class_details.class_session_date": { $lte: new Date() } },
            //{ type_of_class: 1 },
          ],
        },
      },
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
                last_name: { $ifNull: ["$last_name", ""] },
                profile_image: { $ifNull: ["$profile_image", ""] },
              },
            },
          ],
          as: "teacherDetail",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "class_id",
          pipeline: [
            {
              $project: {
                amount: { $ifNull: ["$amount", 0] },
              },
            },
          ],
          as: "transactions",
        },
      },
      {
        $addFields: {
          totalEnrollment: { $size: "$transactions" },
        },
      },
      {
        $project: {
          class_title: 1,
          cover_image: 1,
          type_of_class: 1,
          session_type: 1,
          price: 1,
          max_students_allowed: 1,
          enrolled_students: 1,
          location: 1,
          platformFee: {
            $ifNull: [
              {
                $multiply: [
                  {
                    $sum: {
                      $multiply: ["$price", "$totalEnrollment"],
                    },
                  },
                  { $divide: [commissionAmount.payout_commission, 100] },
                ],
              },
              0,
            ],
          },
          platformFeeInPercentage: {
            $divide: [commissionAmount.payout_commission, 1],
          },
          address_or_class_link: {
            $ifNull: ["$address_or_class_link", "Online"],
          },
          "class_details.session_progress_status": 1,
          "class_details._id": 1,
          teacherDetail: 1,
          totalAmount: { $sum: "$transactions.amount" },
          earning: {
            $ifNull: [
              {
                $subtract: [
                  {
                    $sum: "$transactions.amount",
                  },
                  {
                    $multiply: [
                      { $sum: "$transactions.amount" },
                      { $divide: [commissionAmount.payout_commission, 100] },
                    ],
                  },
                ],
              },
              0,
            ],
          },
          amountPerSession: {
            $ifNull: [
              {
                $divide: [
                  {
                    $subtract: [
                      {
                        $sum: "$transactions.amount",
                      },
                      {
                        $multiply: [
                          { $sum: "$transactions.amount" },
                          {
                            $divide: [commissionAmount.payout_commission, 100],
                          },
                        ],
                      },
                    ],
                  },
                  { $size: "$class_details" },
                ],
              },
              0,
            ],
          },
          transactions: { $size: ["$transactions"] },
        },
      },
      { $sort: { _id: -1 } },
      //],
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: data,
    });
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
// @route    GET api/users/studentDashboard
// @desc     get classes list of auth teacher
// @access   Private
router.get("/studentDashboard", auth, async (req, res) => {
  try {
    var booked_by = req.user.id;
    var result = await BookedClasses.aggregate([
      {
        $match: {
          booked_by: ObjectId(booked_by),
          deleted : 0,
          rating: { $gt: 0 },
          $or: [{ session_progress_status: 1 }, { session_progress_status: 2 }],
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: {
          path: "$classes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$created_by",
          items: {
            $push: "$classes.topics_text",
          },
          //studentsEnrolled: { $sum: "$classes.enrolled_students" },
        },
      },
      {
        $addFields: {
          sessionsSoFar: { $size: "$items" },
          topicsLearned: {
            $size: {
              $reduce: {
                input: "$items",
                initialValue: [],
                in: { $concatArrays: ["$$this", "$$value"] },
              },
            },
          },
        },
      },
      {
        $project: {
          sessionsSoFar: 1,
          topicsLearned: 1,
        },
      },
    ]);
    var allTopicsLearned = 0;
    var allSessionsSoFar = 0;
    for (var i = 0; i < result.length; i++) {
      allTopicsLearned = allTopicsLearned + result[i].topicsLearned;
      allSessionsSoFar = allSessionsSoFar + result[i].sessionsSoFar;
    }

    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        sessionsSoFar: allSessionsSoFar,
        topicsLearned: allTopicsLearned,
        teachers: result.length,
      },
    });
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

// @route    GET v1/users/showRating
// @desc     show rating
// @access   Private
router.get("/getUpcomingSessionForStudentDashboard", auth, async (req, res) => {
  try {
    let booked_by = req.user.id;
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth() + 1;
    var getDay = new Date().getDate();
    getMonth = getMonth.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    getDay = getDay.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    var completeDate = getYear + "-" + getMonth + "-" + getDay;
    var allRecords = await BookedClasses.find({
      deleted:0,
      booked_by: booked_by,
      class_session_date: { $gte: new Date(completeDate) },
      //day_of_class: getDay,
      session_progress_status: 0,
    }).sort({ class_session_date: 1, start_time_of_class: 1 });

    var recordFound = false;
    var result = null;
    function getMinutes(str) {
      var time = str.split(":");
      return time[0] * 60 + time[1] * 1;
    }
    function getMinutesNow() {
      var timeNow = new Date();
      return timeNow.getHours() * 60 + timeNow.getMinutes();
    }
    for (var i = 0; i < allRecords.length; i++) {
      if (!recordFound) {
        var detail = allRecords[i];
        var now = getMinutesNow();
        var start = getMinutes(detail.start_time_of_class);
        console.log("class_title", detail.class_title);
        console.log("date", detail.class_date);
        console.log("start", start);
        console.log("our time", now);
        if (detail.day_of_class == getDay) {
          if (start > now) {
            result = detail;
            recordFound = true;
          }
        } else {
          result = detail;
          recordFound = true;
        }
      }
    }
    if (!result) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            param: "server",
            location: "body",
          },
        ],
      });
    }
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: result,
    });
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

// @route    GET v1/users/showRating
// @desc     show rating
// @access   Private
router.get("/getUpcomingSessionForTeacherDashboard", auth, async (req, res) => {
  try {
    let created_by = req.user.id;
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth() + 1;
    var getDay = new Date().getDate();
    getMonth = getMonth.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    getDay = getDay.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    var completeDate = getYear + "-" + getMonth + "-" + getDay;
    console.log("getMonth.length", getMonth.length);
    console.log(completeDate);
    var allRecords = await classDetailsSchema
      .find({
        created_by: created_by,
        deleted : 0,
        class_session_date: { $gte: new Date(completeDate) },
        //day_of_class: getDay,
        session_progress_status: 0,
      })
      .sort({ class_session_date: 1, start_time_of_class: 1 });

    var recordFound = false;
    var result = null;
    function getMinutes(str) {
      var time = str.split(":");
      return time[0] * 60 + time[1] * 1;
    }
    function getMinutesNow() {
      var timeNow = new Date();
      return timeNow.getHours() * 60 + timeNow.getMinutes();
    }
    for (var i = 0; i < allRecords.length; i++) {
      if (!recordFound) {
        var detail = allRecords[i];
        var now = getMinutesNow();
        var start = getMinutes(detail.start_time_of_class);
        console.log("class_title", detail.class_title);
        console.log("date", detail.class_date);
        console.log("start", start);
        console.log("our time", now);
        if (detail.day_of_class == getDay) {
          if (start > now) {
            result = detail;
            recordFound = true;
          }
        } else {
          result = detail;
          recordFound = true;
        }
      }
    }
    if (!result) {
      return res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No record found",
            param: "server",
            location: "body",
          },
        ],
      });
    }
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: result,
      completeDate,
    });
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

// @route    GET api/users/teacherDashboard
// @desc     get classes list of auth teacher
// @access   Private
router.get("/teacherDashboard", auth, async (req, res) => {
  try {
    var created_by = req.user.id;
    var result = await Classes.aggregate([
      {
        $match: {
          created_by: ObjectId(created_by),
        },
      },
      {
        $group: {
          _id: "created_by",
          items: {
            $push: "$$ROOT",
          },
        },
      },

      {
        $lookup: {
          from: "class_details",
          localField: "items._id",
          foreignField: "class_id",
          pipeline: [
            {
              $match: {
                class_session_date: { $lte: new Date() },
                $or: [
                  { session_progress_status: 1 },
                  { session_progress_status: 2 },
                ],
              },
            },
            {
              $project: {
                session_progress_status: 1,
              },
            },
          ],
          as: "class_details",
        },
      },

      {
        $lookup: {
          from: "transactions",
          localField: "items._id",
          foreignField: "class_id",
          pipeline: [
            {
              $project: {
                amount: { $ifNull: ["$amount", 0] },
                class_id: 1,
              },
            },
          ],
          as: "transactions",
        },
      },
      {
        $addFields: {
          totalEnrollment: { $size: "$transactions" },
        },
      },
      {
        $project: {
          sessionsSoFar: { $size: ["$class_details"] },
          studentsEnrolled: { $size: ["$transactions"] },
          _id: 0,
        },
      },
      { $sort: { _id: -1 } },
      //],
    ]);
    var payoutsDetail = await Payouts.aggregate([
      {
        $match: {
          is_payout_detail_exists: true,
          class_created_by: ObjectId(created_by),
        },
      },
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          pipeline: [
            {
              $match: {
                payout_status: 1,
              },
            },
            {
              $project: {
                paid_amount: 1,
              },
            },
          ],
          as: "payout_details",
        },
      },
      {
        $unwind: "$payout_details",
      },
      {
        $group: {
          _id: "class_created_by",
          items: {
            $push: "$payout_details.paid_amount",
          },
        },
      },
      {
        $project: {
          paid_amount: { $sum: "$items" },
        },
      },
    ]);
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        earning: payoutsDetail.length > 0 ? payoutsDetail[0].paid_amount : 0,
        studentsEnrolled: result.length > 0 ? result[0].studentsEnrolled : 0,
        sessionsSoFar: result.length > 0 ? result[0].sessionsSoFar : 0,
      },
      // result.length > 0
      //   ? result[0]
      //   : {
      //       studentsEnrolled: 0,
      //       sessionsSoFar: 0,
      //       earning: 0,
      //     },
    });
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

router.get("/teacherListing", async (req, res) => {
  try {
    const teacherListing = await User.find(
      { user_role: 2 },
      {
        profile_image: 1,
        first_name: 1,
        last_name: 1,
        state: 1,
        city: 1,
        about_expertise: 1,
        street_address: 1,
      }
    );
    const getteacherlistings = teacherListing.filter((arr) => {
      return arr.about_expertise !== "";
    }, []);
    //  const Rating = await TeachersRating.find({rating_given_to:teacherListing._id},{rating:1})
    res.json({
      success: true,
      message: "Record fetched successfully.",
      data: {
        teacherListing: getteacherlistings,
      },
    });
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

router.get("/getPopularTagsforLandingPage", async (req, res) => {
  try {
    var tags = await Tags.aggregate([
      { $sample: { size: 12 } },
      {
        $match: {
          tag_status: false,
        },
      },
      {
        $project: {
          tag_name: 1,
        },
      },
    ]);
    if (tags.length > 0) {
      res.json({
        success: true,
        message: "Record fetched successfully.",
        data: tags,
      });
    } else {
      res.status(400).send({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "token",
            location: "body",
          },
        ],
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

// @route    GET api/users/studentList/:pageNo
// @desc     Get the student list who event buy my course
// @access   Private
router.get("/studentList/:pageNo", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };
    const TotalResult = await User.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "user_id",
          as: "transaction",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "transaction.class_id",
          foreignField: "_id",
          as: "class_record",
        },
      },
      {
        $match: {
          "transaction.user_id": {
            $exists: true,
          },
          "class_record.created_by": ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    const getAllUsers = await User.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "user_id",
          as: "transaction",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "transaction.class_id",
          foreignField: "_id",
          as: "class_record",
        },
      },
      {
        $match: {
          "transaction.user_id": {
            $exists: true,
          },
          "class_record.created_by": ObjectId(userId),
        },
      },
      {
        $skip: removeData,
      },
      {
        $limit: showData,
      },
    ]);
    // const TotalResult = await Class.aggregate([
    //   {
    //     $match:{
    //       created_by : ObjectId(userId)
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "transactions",
    //       localField: "_id",
    //       foreignField: "class_id",
    //       pipeline:[
    //         {
    //           $project : {
    //             user_id : 1,
    //             class_id:1,
    //           }
    //         }
    //       ],
    //       as: "userIds",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$userIds",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userIds.user_id",
    //       foreignField: '_id',
    //       pipeline:[
    //        {
    //         $project : {
    //           otp:0,
    //           otp_expired:0,
    //           password:0,
    //           location:0,
    //           planned_topics:0,
    //           topics : 0,
    //         }
    //        }
    //       ],
    //       as: "usersDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$usersDetails",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    // ])

    // const getAllUsers = await Class.aggregate([
    //   {
    //     $match:{
    //       created_by : ObjectId(userId)
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "transactions",
    //       localField: "_id",
    //       foreignField: "class_id",
    //       pipeline:[
    //         {
    //           $project : {
    //             user_id : 1,
    //             class_id:1,
    //           }
    //         }
    //       ],
    //       as: "userIds",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$userIds",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userIds.user_id",
    //       foreignField: '_id',
    //       pipeline:[
    //        {
    //         $project : {
    //           otp:0,
    //           otp_expired:0,
    //           password:0,
    //           location:0,
    //           planned_topics:0,
    //           topics : 0,
    //         }
    //        }
    //       ],
    //       as: "usersDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$usersDetails",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   {
    //     $sort : sortData
    //   },
    //   {
    //     $skip : removeData
    //   },
    //   {
    //     $limit : showData
    //   },
    //   {
    //     $project : {
    //       _id :1,
    //       discipline :1,
    //       class_status :1,
    //       topics_text :1,
    //       class_title :1,
    //       class_subtitle :1,
    //       class_description :1,
    //       class_level :1,
    //       language_of_class :1,
    //       cover_image :1,
    //       type_of_class :1,
    //       session_type :1,
    //       price :1,
    //       address_or_class_link :1,
    //       created_at :1,
    //       usersDetails:{$ifNull : ['$usersDetails' , ""]}
    //     }
    //   }
    // ])

    // if(getAllUsers.length == 0){
    //  return res.status(400).json({
    //     success : false,
    //     errors : [{
    //       msg : "No record found !",
    //     }]
    //   })
    // }

    res.json({
      success: true,
      msg: "Record fetch successfully",
      //data:getAllUsersRecords
      data: {
        totalCount: TotalResult.length,
        data: getAllUsers,
      },
    });
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

// @route    GET api/users//getChatToken/:sessionId
// @desc     Get chat token by sessionid
// @access   Private
router.get("/getChatToken/:sessionId", auth, async (req, res) => {
  try {
    const id = req.params.sessionId;

    var result = await classDetailsSchema.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: {
          path: "$classes",
          preserveNullAndEmptyArrays: true,
        },
        // "$unwind": "$classes"
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true,
        },
        // "$unwind": "$users"
      },
      {
        $project: {
          "users.first_name": 1,
          "users.last_name": 1,
          "users.profile_image": 1,
          "users.expertise": 1,
          classes: 1,
          class_session_date: 1,
          start_time_of_class: 1,
          end_time_of_class: 1,
          session_progress_status: 1,
        },
      },
    ]);
    //var updatedArray = [];
    var channelIdForChat = "";
    //for(var i=0;i<result.length;i++){
    var bookedSessionResult = await BookedClasses.find({
      session_id: id,
    }).populate("transaction_id", { invoice_data: 0 });
    var sessionClass = await classDetailsSchema.findOne(
      { _id: id },
      { class_id: 1 }
    );
    if (sessionClass) {
      var sessionTransaction = await Transaction.findOne(
        { class_id: sessionClass.class_id },
        { channel_id: 1 }
      );
      if (sessionTransaction) {
        channelIdForChat = sessionTransaction.channel_id;
      }
    }

    //console.log(sessionTransaction);
    // updatedArray.push({
    //   sessionDetail : result,
    //   bookedSessionResult:bookedSessionResult
    // })
    //}
    var user_id = req.user.id;
    await serverClient.upsertUsers([
      {
        id: user_id,
        role: "admin",
        mycustomfield: "Teachify",
      },
    ]);
    const chatToken = serverClient.createToken(user_id);
    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: {
        sessionDetail: result.length > 0 && result[0],
        bookedSessionResult: bookedSessionResult,
        chat: {
          user_id: user_id,
          chatToken: chatToken,
          channel_id: channelIdForChat,
        },
      },
    });
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

// @route    Put api/users/saveCardDetails
// @desc     save and update card details
// @access   Private
router.put(
  "/saveCardDetails",
  [
    check("card_number", "Card number is required").not().isEmpty(),
    check("card_name", "Card name is required").not().isEmpty(),
    check("card_expiry_date", "Card expire date is required").not().isEmpty(),
    check("card_security_code", "Card security code is required")
      .not()
      .isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      const teacherId = req.user.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      const { card_number, card_name, card_expiry_date, card_security_code } =
        req.body;

      const saveData = {
        teacher_id: teacherId,
        card_number: card_number,
        card_name: card_name,
        card_expiry_date: card_expiry_date,
        card_security_code: card_security_code,
      };

      const saveCardDetails = await CardDetails.findOneAndUpdate(
        {
          teacher_id: teacherId,
        },
        {
          $set: saveData,
        },
        {
          new: true,
          upsert: true,
        }
      );

      if (saveCardDetails) {
        res.json({
          success: true,
          msg: "Card details saved.",
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
  }
);

// @route    GET api/users/saveCardDetails
// @desc     Save card details
// @access   Private
router.get("/saveCardDetails", auth, async (req, res) => {
  try {
    const teacherId = req.user.id;

    const saveCardDetails = await CardDetails.findOne({
      teacher_id: teacherId,
    });

    if (!saveCardDetails) {
      return res.json({
        success: false,
        errors: [
          {
            msg: "Record not found.",
          },
        ],
      });
    }

    if (saveCardDetails) {
      res.json({
        success: true,
        msg: "Record found.",
        data: saveCardDetails,
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

// @route    GET api/users/saveAccoutInfo
// @desc     Save account info
// @access   Private
router.put(
  "/saveAccoutInfo",
  [
    check("account_num", "Account number is required").not().isEmpty(),
    check("account_holder_name", "Account holder name is required")
      .not()
      .isEmpty(),
    check("routing_num", "Routing number is required")
      .not()
      .isEmpty()
      .isNumeric(),
  ],
  auth,
  async (req, res) => {
    try {
      const teacherId = req.user.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { account_num, account_holder_name, routing_num } = req.body;

      const saveData = {
        account_number: account_num,
        card_name: account_holder_name,
        routing_number: routing_num,
      };

      const saveCardDetails = await AccountDetail.findOneAndUpdate(
        {
          teacher_id: teacherId,
        },
        {
          $set: saveData,
        },
        {
          new: true,
          upsert: true,
        }
      );

      if (saveCardDetails) {
        res.json({
          success: true,
          msg: "Account details saved.",
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
  }
);

// @route    GET api/users/saveAccoutInfo
// @desc     Save card details
// @access   Private
router.get("/saveAccoutInfo", auth, async (req, res) => {
  try {
    const teacherId = req.user.id;

    const saveCardDetails = await AccountDetail.findOne({
      teacher_id: teacherId,
    });

    if (!saveCardDetails) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            msg: "Record not found.",
          },
        ],
      });
    }

    if (saveCardDetails) {
      res.json({
        success: true,
        msg: "Record found.",
        data: saveCardDetails,
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

// @route    GET api/users/studentRatingList
// @desc     Get teacher rating list
// @access   Private
router.get("/studentRatingList/:userId/:pageNo", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };

    const getRatingList = await BookedClasses.aggregate([
      {
        $match: {
          booked_by: ObjectId(userId),
          rating: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                profile_image: { $ifNull: ["$profile_image", ""] },
                first_name: { $ifNull: ["$first_name", ""] },
              },
            },
          ],
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $sort: sortData,
      },
      {
        $skip: removeData,
      },
      {
        $limit: showData,
      },
      {
        $project: {
          userDetail: 1,
          feedback: { $ifNull: ["$feedback", ""] },
          rating: 1,
        },
      },
    ]);

    // if (getRatingList.length == 0) {
    //   return res.json({
    //     success: false,
    //     data: getRatingList,
    //   });
    // }

    res.json({
      success: true,
      msg: "Record found successfully",
      data: getRatingList,
    });
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

// @route    GET api/users/teacherRatingList
// @desc     Get student rating list
// @access   Private
router.get("/teacherRatingList/:userId/:pageNo", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };

    const getRatingList = await TeachersRating.aggregate([
      {
        $match: {
          rating_given_to: ObjectId(userId),
          deleted: 0,
          rating: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                profile_image: { $ifNull: ["$profile_image", ""] },
                first_name: { $ifNull: ["$first_name", ""] },
              },
            },
          ],
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $sort: sortData,
      },
      {
        $skip: removeData,
      },
      {
        $limit: showData,
      },
      {
        $project: {
          userDetail: 1,
          feedback: { $ifNull: ["$feedback", ""] },
          rating: 1,
        },
      },
    ]);

    // if (getRatingList.length == 0) {
    //   return res.json({
    //     success: true,
    //     data: getRatingList,
    //   });
    // }

    res.json({
      success: true,
      msg: "Record found successfully",
      data: getRatingList,
    });
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

// @route    GET api/users/studentRatingListWithAuth
// @desc     Get teacher rating list
// @access   Private
router.get("/studentRatingListWithAuth/:pageNo", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };

    const getRatingList = await BookedClasses.aggregate([
      {
        $match: {
          booked_by: ObjectId(userId),
          rating: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                profile_image: { $ifNull: ["$profile_image", ""] },
                first_name: { $ifNull: ["$first_name", ""] },
              },
            },
          ],
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $sort: sortData,
      },
      {
        $skip: removeData,
      },
      {
        $limit: showData,
      },
      {
        $project: {
          userDetail: 1,
          feedback: { $ifNull: ["$feedback", ""] },
          rating: 1,
        },
      },
    ]);

    // if (getRatingList.length == 0) {
    //   return res.json({
    //     success: false,
    //     data: getRatingList,
    //   });
    // }

    res.json({
      success: true,
      msg: "Record found successfully",
      data: getRatingList,
    });
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

// @route    GET api/users/teacherRatingListWithAuth
// @desc     Get student rating list
// @access   Private
router.get("/teacherRatingListWithAuth/:pageNo", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };

    const getRatingList = await TeachersRating.aggregate([
      {
        $match: {
          rating_given_to: ObjectId(userId),
          deleted: 0,
          rating: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                profile_image: { $ifNull: ["$profile_image", ""] },
                first_name: { $ifNull: ["$first_name", ""] },
              },
            },
          ],
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $sort: sortData,
      },
      {
        $skip: removeData,
      },
      {
        $limit: showData,
      },
      {
        $project: {
          userDetail: 1,
          feedback: { $ifNull: ["$feedback", ""] },
          rating: 1,
        },
      },
    ]);

    // if (getRatingList.length == 0) {
    //   return res.json({
    //     success: true,
    //     data: getRatingList,
    //   });
    // }

    res.json({
      success: true,
      msg: "Record found successfully",
      data: getRatingList,
    });
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
// @route    post api/users/reportuser
// @desc     post report user
// @access   Private
router.post(
  "/reportClass",
  [
    check("report_title", "Title is required").not().isEmpty(),
    check("report_description", "Description is required").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      const reported_by = req.user.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      const { class_id, report_title, report_description } = req.body;

      const saveData = {
        class_id: class_id,
        reported_by: reported_by,
        report_title: report_title,
        report_description: report_description,
      };

      const report_class = new ReportClass(saveData);
      await report_class.save();

      if (report_class) {
        res.json({
          success: true,
          message: "Class reported successfully.",
        });
      }
    } catch (err) {
      console.log(err, "error");
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
  }
);

// @route    post api/users/reportUser
// @desc     post report user
// @access   Private
router.post(
  "/reportUser",
  [
    check("report_title", "Title is required").not().isEmpty(),
    check("report_description", "Description is required").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      const reported_by = req.user.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      const { reported_to, report_title, report_description } = req.body;

      const saveData = {
        reported_to: reported_to,
        reported_by: reported_by,
        report_title: report_title,
        report_description: report_description,
      };

      const report_user = new ReportUser(saveData);
      await report_user.save();

      if (report_user) {
        res.json({
          success: true,
          message: "User reported successfully.",
        });
      }
    } catch (err) {
      console.log(err, "error");
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
  }
);

router.post(
  "/notificationSettings",
  [
    check(
      "notification_type",
      "Notification type is required (1 for Sessions and 2 for Financials)"
    )
      .not()
      .isEmpty(),
    check("setting_title", "Setting title is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { notification_type, setting_title, user_role } = req.body;

    try {
      var notificationDetails = {};
      notificationDetails.notification_type = notification_type;
      notificationDetails.setting_title = setting_title;
      notificationDetails.user_role = user_role;
      notificationDetails.deleted = 0;
      notificationDetails.created_at = new Date();
      const notificationSettingsRecord = new NotificationsSettings(
        notificationDetails
      );

      const data = await notificationSettingsRecord.save();
      res.json({
        success: true,
        message: "Record saved successfully",
        data: data,
      });
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
  }
);

router.get("/notificationSettings/:user_role", auth, async (req, res) => {
  const { user_role } = req.params;
  try {
    var data = await NotificationsSettings.aggregate([
      [
        {
          $match: {
            user_role: parseInt(user_role),
          },
        },
        {
          $lookup: {
            from: "notification_setting_records",
            localField: "_id",
            foreignField: "notification_id",
            as: "userDetail",
          },
        },
        {
          $addFields: {
            userDetail: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$userDetail",
                    as: "user",
                    cond: {
                      $eq: ["$$user.user_id", ObjectId(req.user.id)],
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            setting_title: 1,
            notification_type: 1,
            "userDetail.activation_status": {
              $ifNull: ["$userDetail.activation_status", false],
            },
          },
        },
        {
          $group: {
            _id: "$notification_type",
            notifications: {
              $push: "$$ROOT",
            },
          },
        },
        { $sort: { _id: 1 } },
      ],
    ]);

    res.json({
      success: true,
      message: "Record fetched successfully",
      data: {
        notificationRecord: data,
        mainTitleArray: ["", "Sessions", "Financials"],
      },
    });
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

router.post(
  "/notificationSettingsRecord",
  auth,
  [
    check("notification_id", "Notification id is required").not().isEmpty(),
    check("activation_status", "Activation status is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { notification_id, activation_status } = req.body;

    try {
      var user_id = req.user.id;
      var notificationDetails = {};
      notificationDetails.notification_id = notification_id;
      notificationDetails.user_id = user_id;
      notificationDetails.activation_status = activation_status;
      notificationDetails.deleted = 0;
      notificationDetails.created_at = new Date();
      var data = await NotificationSettingsRecords.findOneAndUpdate(
        {
          user_id: user_id,
          notification_id: notification_id,
        },
        { $set: notificationDetails },
        { new: true, upsert: true }
      );
      res.json({
        success: true,
        message: "Record saved successfully",
        data: data,
      });
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
  }
);

router.get("/getMyUpcomingClasses", 
//auth,
 async (req, res) => {
  try {
    var allClassDetails = await BookedClasses.find();
    for (var i = 0; i < allClassDetails.length; i++) {
      await BookedClasses.findOneAndUpdate(
        {
          _id: allClassDetails[i]._id,
        },
        {
          $set: {
            deleted:0
          },
        }
      );
    }
    return res.json({
      msg : "Data updated successfully"
    });

    var currentDate = new Date();
    var month = currentDate.getMonth() + 1;
    var class_detail = [
      {
        class_date: "2022-12-01",
        class_start_time: "17:30",
        class_end_time: "19:30",
      },
    ];
    var formattedCurrentDate = `${currentDate.getFullYear()}-${(
      "0" + month
    ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}T00:00:00.000Z`;

    var getAllUpcomingClasses = await classDetailsSchema.find(
      {
        class_session_date: {
          $gte: formattedCurrentDate,
        },
        created_by: req.user.id,
      },
      {
        class_date: 1,
        end_time_of_class: 1,
        start_time_of_class: 1,
      }
    );
    function getMinutes(str) {
      var time = str.split(":");
      return time[0] * 60 + time[1] * 1;
    }
    const tConvert = (time24) => {
      const [sHours, minutes] = time24
        .match(/([0-9]{1,2}):([0-9]{1,2})/)
        .slice(1);
      const period = +sHours < 12 ? "AM" : "PM";
      const hours = +sHours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    };
    const messageAsPerDateAndTime = (
      start_time_of_class,
      end_time_of_class,
      class_date
    ) => {
      return `Session is already added with time slot of ${tConvert(
        start_time_of_class
      )} - ${tConvert(end_time_of_class)} on ${class_date}`;
    };
    var errorsArray = [];
    for (var i = 0; i < getAllUpcomingClasses.length; i++) {
      for (
        var comingClasses = 0;
        comingClasses < class_detail.length;
        comingClasses++
      ) {
        var dateEnterByUser = new Date(class_detail[comingClasses].class_date);
        var dateAvailableInRecords = new Date(
          getAllUpcomingClasses[i].class_date
        );
        if (dateEnterByUser.getTime() === dateAvailableInRecords.getTime()) {
          var endTimeEnterByUser = getMinutes(
            class_detail[comingClasses].class_end_time
          );
          var endTimeInRecords = getMinutes(
            getAllUpcomingClasses[i].end_time_of_class
          );
          var startEnterByUser = getMinutes(
            class_detail[comingClasses].class_start_time
          );
          var startTimeInRecords = getMinutes(
            getAllUpcomingClasses[i].start_time_of_class
          );
          if (
            (startTimeInRecords < startEnterByUser &&
              startEnterByUser < endTimeInRecords) ||
            (startTimeInRecords < endTimeEnterByUser &&
              endTimeEnterByUser < endTimeInRecords) ||
            (startEnterByUser < startTimeInRecords &&
              startTimeInRecords < endTimeEnterByUser) ||
            (startEnterByUser < endTimeInRecords &&
              endTimeInRecords < endTimeEnterByUser)
          ) {
            errorsArray.push({
              msg: messageAsPerDateAndTime(
                getAllUpcomingClasses[i].start_time_of_class,
                getAllUpcomingClasses[i].end_time_of_class,
                getAllUpcomingClasses[i].class_date
              ),
            });
          }
        }
      }
    }
    if (errorsArray.length > 0) {
      res.status(400).send({
        success: false,
        errors: errorsArray,
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


router.put(
  "/deleteClass",
  auth,
  async (req, res) => {

    const { class_id } = req.body;

    try {
      const checkClassDetail = await Classes.findOne({
        _id: class_id
      });
      if(checkClassDetail.enrolled_students == 0){
        await Classes.findOneAndUpdate(
          {
            _id: class_id
          },
          { $set: {
            class_status : 2
          } }
        );
        await classDetailsSchema.findOneAndUpdate(
          {
            class_id: class_id
          },
          { $set: {
            deleted : 1
          } }
        );
        await Payouts.findOneAndUpdate(
          {
            class_id: class_id,
            payout_start_date : {
              $gte : new Date()
            }
          },
          { $set: {
            deleted : 1
          } }
        );
        res.json({
          success: true,
          message: "Class deleted successfully"
        });
      }
      else{
        res.status(400).send({
          success: false,
          errors: [
            {
              msg: "Students already entrolled into this class",
              param: "server",
              location: "body",
            },
          ],
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
  }
);


module.exports = router;
