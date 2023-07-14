const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const StreamChat = require("stream-chat").StreamChat;
const sendGridAPiKey = process.env.SENDGRID;
const sgMail = require("@sendgrid/mail");
const site_url = process.env.SITE_URL;
const Admin = require("../../../models/Admin");
const User = require("../../../models/User");
const Dropdown = require("../../../models/Dropdown");
const Transaction = require("../../../models/Transaction");
const Payouts = require("../../../models/Payouts");
const PayoutsDetails = require("../../../models/PayoutsDetails");
const Subadmin = require("../../../models/SubAdmins");
const classDetailsSchema = require("../../../models/ClassDetails");
const Classes = require("../../../models/Classes");
const Notifications = require("../../../models/Notifications");
const NotificationEmailTemplates = require("../../../models/NotificationEmailTemplates");
const BookedClasses = require("../../../models/BookedClasses");
const StudentsRating = require("../../../models/StudentsRating");
const TeachersRating = require("../../../models/TeachersRating");
const Commission = require("../../../models/Commission");
const RefundRequests = require("../../../models/RefundRequests");

const getSteamKey = process.env.GETSTREAM_KEY;
const getSteamSecret = process.env.GETSTREAM_SECRET;
const serverClient = StreamChat.getInstance(getSteamKey, getSteamSecret);
const Helper = require("../helper/helper");
// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    var user = await Admin.findById(req.user.id).select("-password");
    if (!user) {
      user = await Subadmin.findById(req.user.id).select("-password");
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
router.get("/link-expiry-check/:id", async (req, res) => {
  try {
    var user = await Admin.findById(req.params.id).select("-password");
    if (!user) {
      user = await Subadmin.findById(req.params.id).select("-password");
    }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !user) {
      return res.json({ status: 2 });
    } else if (user) {
      if (user.verification_link_expire) {
        return res.json({
          status: 0,
        });
      } else {
        return res.json({
          status: 1,
        });
      }
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// @route    POST /v1/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/",
  [
    check("email", "Registered email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      var role = 0;
      var user = await Admin.findOne({ email: email });

      if (!user) {
        role = 3;
        user = await User.findOne({
          email: email,
          user_role: role,
          account_status: 1,
        });
      }

      // var phone_verification_code = Math.floor(1000 + Math.random() * 9000);
      // var message = "Your OTP code is: "+phone_verification_code+'. The OTP code will expire after 5 minutes.';
      //    var testing = await client.messages
      // .create({body: message, from: '+15034066309', to: '+917973694843'});
      // console.log(message);
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              success: false,
              response: "error",
              param: "email",
              msg: "Please use registered email",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              success: false,
              response: "error",
              param: "password",
              msg: "Please use correct password",
            },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            response: "successful",
            message: "User is successfully logged in",
            data: {
              token: token,
              role: role,
            },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/dashboard/users",
  //auth,
  async (req, res) => {
    try {
      const recentUsers = await User.find({
        $or: [{ deleted: 0 }, { deleted: 1 }],
      })
        .sort({ created_at: -1 })
        .limit(5);

      res.json({
        data: recentUsers,
        message: "Data fetched successfully",
        success: true,
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

router.get("/getLocationsList", auth, async (req, res) => {
  try {
    const getStates = await User.aggregate([{ $group: { _id: "$state" } }]);
    const getCities = await User.aggregate([{ $group: { _id: "$city" } }]);
    //const recentUsersList = await User.find(search).sort({created_at:-1});

    res.json({
      success: true,
      message: "Data fetched successfully",
      data: {
        states: getStates,
        cities: getCities,
      },
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/usersList", auth, async (req, res) => {
  try {
    const { name, user_role, account_status, page, location_type, location } =
      req.query;
    var search = {};
    var pageNo = 1;
    var limit = 10;
    if (page && page != "") {
      pageNo = page;
    }
    var skip = (pageNo - 1) * limit;

    if (name && name != "") {
      search["first_name"] = { $regex: name, $options: "i" };
    }
    if (location_type == 1 && location && location != "") {
      search["state"] = location;
    }
    if (location_type == 2 && location && location != "") {
      search["city"] = location;
    }
    if (user_role && user_role != "") {
      search["user_role"] = user_role;
    }
    if (account_status && account_status != "") {
      search["account_status"] = account_status;
    }
    search["$or"] = [
      {
        deleted: 0,
      },
      {
        deleted: 1,
      },
    ];
    const totalUsers = await User.find(search, { _id: 1 }).sort({
      created_at: -1,
    });
    const recentUsersList = await User.find(search)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      data: recentUsersList,
      totalPages:
        totalUsers.length != 0 ? Math.ceil(totalUsers.length / limit) : 0,
      totalUsers: totalUsers.length,
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// Single User Details
router.get("/singleUserInfo/:id", auth, async (req, res) => {
  try {
    const singleUserInfo = await User.findOne({ _id: req.params.id }).select(
      "-password"
    );
    if (!singleUserInfo) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "No data Found",
          },
        ],
      });
    }
    //console.log(singleUseriN);
    res.json({
      success: true,
      message: "Record fetched successfully",
      data: singleUserInfo,
    });
  } catch (error) {
    console.error(error.message);
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

router.get("/getUserTransactions/:id", auth, async (req, res) => {
  try {
    var transactionsData = await Transaction.find({
      user_id: req.params.id,
    });

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

router.get(
  "/dashboard/getSessionsOfSelectedMonth",
  //auth,
  async (req, res) => {
    try {
      var result = await classDetailsSchema.find({
        class_session_date: { $gte: new Date() },
      });
      console.log(result);
      var sessions = result.map(function (detail) {
        return {
          year: detail.year_of_class,
          month: detail.month_of_class,
          day: detail.day_of_class,
          className: "activeDay",
        };
      });

      res.json({
        success: true,
        message: "Data fetched successfully.",
        data: sessions,
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

router.get(
  "/userCalender/:id",
  //auth,
  async (req, res) => {
    try {
      var user_id = req.params.id;
      var userData = await User.findOne(
        { _id: user_id },
        { user_role: 1, user_created_by_admin: 1 }
      );
      var result = [];
      if (userData && userData.user_role == 1) {
        result = await BookedClasses.find({ booked_by: user_id });
      } else if (userData && userData.user_role == 2) {
        result = await classDetailsSchema.find({ created_by: user_id });
      }
      var sessions = result.map(function (detail) {
        return {
          year: detail.year_of_class,
          month: detail.month_of_class,
          day: detail.day_of_class,
          className: "activeDay",
        };
      });

      res.json({
        success: true,
        message: "Data fetched successfully.",
        data: sessions,
        userData: userData,
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

// router.get(
//   "/sessionCalender/getSessionsBetweenSelectedDates",
//   auth,
//   async (req, res) => {
//     try {
//       var start_date = req.query.start_date;
//       var end_date = req.query.end_date;
//       if (!end_date || !start_date) {
//         return res.status(400).send({
//           success: false,
//           errors: [
//             {
//               msg: "end_date or start_date query string parameter is missing",
//               param: "query string",
//               location: "body",
//             },
//           ],
//         });
//       }
//       var result = await classDetailsSchema.find({
//         $and: [
//           { class_session_date: { $gte: start_date } },
//           { class_session_date: { $lte: end_date } },
//         ],
//       });
//       console.log(result);
//       var sessions = result.map(function (detail) {
//         let day = detail.day_of_class.toLocaleString("en-US", {
//           minimumIntegerDigits: 2,
//           useGrouping: false,
//         });
//         let month = detail.month_of_class.toLocaleString("en-US", {
//           minimumIntegerDigits: 2,
//           useGrouping: false,
//         });
//         return {
//           title: detail.class_title,
//           date: detail.year_of_class + "-" + month + "-" + day,
//           url: `/session-details/${detail._id}`,
//         };
//       });

//       res.json({
//         success: true,
//         message: "Data fetched successfully.",
//         data: sessions,
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

router.post(
  "/sessionCalender/getSessionsBetweenSelectedDates",
  auth,
  async (req, res) => {
    try {
      const {
        start_date,
        end_date,
        class_title,
        type_of_class,
        session_progress_status,
        payout_status,
      } = req.body;

      if (!end_date || !start_date) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: "end_date or start_date query string parameter is missing",
              param: "query string",
              location: "body",
            },
          ],
        });
      }
      var search = {
        $and: [
          { class_session_date: { $gte: new Date(start_date) } },
          { class_session_date: { $lte: new Date(end_date) } },
        ],
      };
      if (class_title && class_title.trim() != "") {
        search["classes.class_title"] = { $regex: class_title, $options: "i" };
      }
      if (type_of_class && type_of_class != 0) {
        search["classes.type_of_class"] = type_of_class;
      }
      if (session_progress_status && session_progress_status >= 0) {
        search["session_progress_status"] = session_progress_status;
      }
      if (payout_status && payout_status >= 0) {
        search["payout_details.payout_status"] = payout_status;
      }

      //var result = await classDetailsSchema.find(search);
      var result = await classDetailsSchema.aggregate([
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
            from: "payouts",
            localField: "_id",
            foreignField: "session_ids",
            as: "payouts",
          },
        },
        {
          $lookup: {
            from: "payout_details",
            localField: "payouts._id",
            foreignField: "payout_id",
            as: "payout_details",
          },
        },
        {
          $match : search
        },
        // {
        //   $project : {
        //     class_title : { $ifNull: ["$classes.class_title", ""] },
        //     day_of_class:1,
        //     month_of_class: 1,
        //     year_of_class: 1
        //   }
        // }
      ])
      console.log(result);
      var sessions = result.map(function (detail) {
        let day = detail.day_of_class.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        let month = detail.month_of_class.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        return {
          title: detail.class_title,
          date: detail.year_of_class + "-" + month + "-" + day,
          url: `/session-details/${detail._id}`,
        };
      });

      res.json({
        success: true,
        message: "Data fetched successfully.",
        data: sessions,
        result
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

router.post("/session/getAllSessions", auth, async (req, res) => {
  try {
    const {
      page,
      class_title,
      type_of_class,
      session_progress_status,
      payout_status,
    } = req.body;
    var limit = 10;
    var pageNo = 1;
    if (page) {
      pageNo = page;
    }
    var skip = (pageNo - 1) * limit;
    // var start_date = req.query.start_date;
    // var end_date = req.query.end_date;
    // if (!end_date || !start_date) {
    //   return res.status(400).send({
    //     success: false,
    //     errors: [
    //       {
    //         msg: "end_date or start_date query string parameter is missing",
    //         param: "query string",
    //         location: "body",
    //       },
    //     ],
    //   });
    // }
    var search = {};
    if (class_title && class_title.trim() != "") {
      search["classes.class_title"] = { $regex: class_title, $options: "i" };
    }
    if (type_of_class && type_of_class != 0) {
      search["classes.type_of_class"] = type_of_class;
    }
    if (session_progress_status && session_progress_status >= 0) {
      search["session_progress_status"] = session_progress_status;
    }
    if(session_progress_status == 0){
      search["session_progress_status"] = session_progress_status;
    }
    if (payout_status && payout_status >= 0) {
      search["payout_details.payout_status"] = payout_status;
    }
    // var result = await Classes.aggregate([
    //   {
    //     $lookup: {
    //       from: "class_details",
    //       localField: "_id",
    //       foreignField: "class_id",
    //       as: "class_details",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "created_by",
    //       foreignField: "_id",
    //       as: "users",
    //     },
    //   },

    //   { $match: search },
    //   { $skip: skip },
    //   { $limit: limit },
    //   {
    //     $project: {
    //       "users.first_name": 1,
    //       "users.last_name": 1,
    //       "users.profile_image": 1,
    //       class_title: 1,
    //       type_of_class: 1,
    //       session_type: 1,
    //       enrolled_students: 1,
    //       "class_details.class_session_date": 1,
    //       "class_details.start_time_of_class": 1,
    //       "class_details.end_time_of_class": 1,
    //       "class_details.session_progress_status": 1,
    //     },
    //   },
    // ]);
    console.log(search);
    var totalResults = await classDetailsSchema.aggregate([
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
          from: "payouts",
          localField: "_id",
          foreignField: "session_ids",
          as: "payouts",
        },
      },
      {
        $lookup: {
          from: "payout_details",
          localField: "payouts._id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      {
        $match : search
      },
      { $match: search },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    var result = await classDetailsSchema.aggregate([
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
        $lookup: {
          from: "report_classes",
          localField: "class_id",
          foreignField: "class_id",
          as: "report_classes",
        },
      },
      {
        $unwind: "$classes",
      },

      {
        $unwind: "$users",
      },
      { $match: search },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          "users.first_name": 1,
          "users.last_name": 1,
          "users.profile_image": 1,
          "users._id": 1,
          "classes.class_title": 1,
          "classes.type_of_class": 1,
          "classes.session_type": 1,
          "classes._id": 1,
          "classes.enrolled_students": 1,
          class_session_date: 1,
          class_date: 1,
          start_time_of_class: 1,
          end_time_of_class: 1,
          session_progress_status: 1,
          payout_status: 1,
          // "report_classes":1,
          classReportStatus: {
            $let: {
              vars: {
                checkReportClassStatus: "$report_classes",
              },
              in: {
                $cond: {
                  if: { $gt: [{ $size: "$$checkReportClassStatus" }, 0] },
                  then: true,
                  else: false,
                },
              },
            },
          },
        },
      },
    ]);
    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: {
        sessions: result,
        totalPages: Math.ceil(totalResults.length / limit),
        search
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

router.get("/session/singleSessionDetail/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    var result = await classDetailsSchema.aggregate([
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
        $lookup: {
          from: "report_classes",
          localField: "class_id",
          foreignField: "class_id",
          as: "report_classes",
        },
      },
      {
        $unwind: {
          path: "$report_classes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "report_classes.reported_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: 1,
                last_name: 1,
                profile_image: 1,
              },
            },
          ],
          as: "report_classes.reportDeatils",
        },
      },
      {
        $unwind: {
          path: "$classes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { _id: ObjectId(id) },
      },
      // {
      //   $project: {
      //     "users.first_name": 1,
      //     "users.last_name": 1,
      //     "users.profile_image": 1,
      //     "users.expertise": 1,
      //     classes: 1,
      //     class_session_date: 1,
      //     start_time_of_class: 1,
      //     end_time_of_class: 1,
      //     session_progress_status: 1,
      //     report_classes: {
      //       $let: {
      //         vars: {
      //           checkReportClassesArr: {
      //             $first: "$report_classes.reportDeatils",
      //           },
      //         },
      //         in: {
      //           $cond: {
      //             if: {
      //               $gt: [
      //                 { $size: { $objectToArray: "$$checkReportClassesArr" } },
      //                 0,
      //               ],
      //             },
      //             then: "$report_classes",
      //             else: {},
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
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
    function getMinutes(str) {
      var time = str.split(":");
      return time[0] * 60 + time[1] * 1;
    }
    function getMinutesNow() {
      var timeNow = new Date();
      return timeNow.getHours() * 60 + timeNow.getMinutes();
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
    var sessionLable = "-";
    if(result.length > 0){
      var start_time_of_class = result[0].start_time_of_class;
    var end_time_of_class = result[0].end_time_of_class;
    var now = getMinutesNow();
    var start = getMinutes(start_time_of_class);
    var end = getMinutes(end_time_of_class);
    const currentDateToMatch = new Date();

    var dateStatus = dateInPast(
      result[0].class_session_date,
      currentDateToMatch
    );
    if (dateStatus == 1) {
      if (now < start) {
        console.log(now);
        console.log(start);
        sessionLable =
          "SESSION WILL START ON " +
          tConvert(result[0].start_time_of_class);
        triggerTime = (start - now) * 60000;
      } else if (
        now >= start &&
        result[0].session_progress_status == 0 &&
        now < end
      ) {
        sessionLable = "Not started yet.";
      } else if (result[0].session_progress_status == 0 && now > end) {
        sessionLable = "Session Expired.";
      } else if (
        now >= start &&
        result[0].session_progress_status == 1 &&
        now < end
      ) {
        sessionLable = "Session in progress.";
      } else if (result[0].session_progress_status == 1 && now > end) {
        sessionLable = "Rating pending.";
      } else if (result[0].session_progress_status == 2) {
        var checkRating = await BookedClasses.findOne(
          { session_id: session_id, rating: { $gt: 0 } },
          { _id: 1 }
        );
        if (checkRating) {
          sessionLable = "Session Completed.";
        }
        sessionLable = "Rating pending.";
      }
    }
    console.log(dateStatus)
    if (dateStatus == 2) {
      var sessionLable =
        "Session will start on " +
        new Date(result[0].class_date).toDateString();
        if (result[0].session_progress_status == 1) {
          sessionLable = "Rating pending.";
        }else if (result[0].session_progress_status == 2) {
          sessionLable = "Session Completed.";
        }
    } else if (dateStatus == 0) {
      if (result[0].session_progress_status == 0) {
        sessionLable = "Session Expired.";
      } else if (result[0].session_progress_status == 1) {
        sessionLable = "Rating pending.";
      } else if (result[0].session_progress_status == 2) {
        var checkRating = await BookedClasses.findOne(
          { session_id: session_id, rating: { $gt: 0 } },
          { _id: 1 }
        );
        if (checkRating) {
          sessionLable = "Session Completed.";
        } else {
          sessionLable = "Rating pending.";
        }
      }
    }
    if (result[0].classes.enrolled_students == 0) {
      sessionLable = "No Student Enrolled yet";
    }
    }
    const chatToken = serverClient.createToken(user_id);
    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: {
        sessionDetail: result.length > 0 && result[0],
        bookedSessionResult: bookedSessionResult,
        sessionLable: sessionLable,
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

router.get("/sessionList", auth, async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    var search = {};
    if (start_date && end_date) {
      search["$and"] = [
        { class_session_date: { $gte: start_date } },
        { class_session_date: { $lte: end_date } },
      ];
    }
    // if(!end_date || !start_date){
    //   return res.status(400).send({
    //     success:false,
    //     "errors": [
    //       {
    //           "msg": "end_date or start_date query string parameter is missing",
    //           "param": "query string",
    //           "location": "body"
    //       }
    //   ]
    //   });
    // }
    var result = await classDetailsSchema
      .find(search)
      .populate("created_by")
      .populate("class_id");
    console.log(result);
    // var sessions = result.map(function(detail) {
    //   let day = (detail.day_of_class).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    //   });
    //   let month = (detail.month_of_class).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    //   });
    //     return { "title": detail.class_title, "date": detail.year_of_class+'-'+month+'-'+day,url: 'http://google.com/'};

    //   });

    res.json({
      success: true,
      message: "Data fetched successfully.",
      data: sessions,
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
// @route    GET /dashboard/transactions
// @desc     Get transaction history
// @access   Public
router.get(
  "/dashboard/transactions",
  //[auth],
  async (req, res) => {
    try {
      const transactions = await Transaction.find({ deleted: 0 })
        .sort({ created_at: -1 })
        .limit(5);
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
  }
);

// @route    GET /studentStats/:id
// @desc     Get student stats
// @access   Public
router.get("/studentStats/:id", [auth], async (req, res) => {
  try {
    var user_id = req.params.id;
    const transactions = await Transaction.find(
      { user_id: user_id },
      { _id: 1 }
    );
    //const transactions = await BookedClasses.find({ booked_by : user_id, $or : [{session_progress_status : 1}, {session_progress_status : 2}] },{_id:1});

    res.json({
      success: true,
      message: "Record fetch successfully",
      data: {
        totalAmountSpend: transactions.length,
        //Data : Data
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

router.get("/usersRecord/:pageNo", auth, async (req, res) => {
  try {
    var showPagination;
    var pageNo = req.params.pageNo;
    var showData = 10;
    var removeData = (pageNo - 1) * showData;
    var sort = req.query.sort;
    var sortObject = { created_at: -1 };
    if (sort == 1) {
      sortObject = { created_at: -1 };
    } else if (sort == 2) {
      sortObject = { created_at: 1 };
    } else if (sort == 3) {
      sortObject = { account_status: 1 };
    } else if (sort == 4) {
      sortObject = { firstname: 1 };
    } else if (sort == 5) {
      sortObject = { email: 1 };
    } else if (sort == 6) {
      sortObject = { flag_raised: -1 };
    }
    const user = await User.find(
      {
        $or: [{ deleted: 0 }, { deleted: 1 }],
      },
      {
        firstname: 1,
        email: 1,
        phone: 1,
        age: 1,
        profile_image: 1,
        identity: 1,
        interest_in: 1,
        account_status: 1,
        deleted: 1,
        flag_raised: 1,
        created_at: 1,
      }
    )
      .skip(removeData)
      .limit(showData)
      .sort(sortObject);
    const userDataTotal = await User.find(
      {
        $or: [{ deleted: 0 }, { deleted: 1 }],
      },
      { _id: 1 }
    );
    //console.log(user);
    if (user.length == 0) {
      return res.status(400).json({
        errors: [
          {
            status: 0,
            response: "error",
            param: "id",
            msg: "No record found",
          },
        ],
      });
    }
    var newArray = [];
    var count = 0;
    count = Number(removeData) + Number(1);
    var totalPages = Math.ceil(userDataTotal.length / 10);
    showPagination = [1];
    if (pageNo == 1 || pageNo == 2) {
      if (totalPages == 1) {
        showPagination = [1];
      } else if (totalPages == 2) {
        showPagination = [1, 2];
      } else {
        showPagination = [1, 2, 3];
      }
    } else {
      var pre = pageNo - 1;
      var next = pageNo + Number(1);

      if (totalPages > next) {
        showPagination = [pre, pageNo, next];
      } else {
        showPagination = [pre, pageNo];
      }
    }

    for (var i = 0; i < user.length; i++) {
      var identityData = await Dropdown.findOne(
        { name: "identity" },
        { options: 1, _id: 0 }
      );
      let identityValue = user[i].identity;
      let identityName = identityData.options[identityValue];
      var lookingForData = await Dropdown.findOne(
        { name: "gender" },
        { options: 1, _id: 0 }
      );
      let lookingForValue = user[i].interest_in;
      let lookingForName = lookingForData.options[lookingForValue];
      if (user[i].deleted == 1) {
        var userStatus = await User.findOneAndUpdate(
          { _id: user[i]._id },
          { $set: { account_status: 1 } }
        );
      }

      newArray.push({
        _id: user[i]._id,
        firstname: user[i].firstname,
        email: user[i].email,
        phone: user[i].phone,
        age: user[i].age,
        profile_image:
          user[i].profile_image.length > 0 ? user[i].profile_image[0] : "",
        identity: identityName,
        interest_in: lookingForName,
        srNo: count++,
        showPagination: showPagination,
        totalPages: totalPages,
        account_status: user[i].account_status,
        flag_raised: user[i].flag_raised,
        created_at: user[i].created_at,
      });
    }

    res.json({
      data: newArray,
      total: userDataTotal.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/updateStatus/:userId/:statusType", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const statusType = req.params.statusType;

    let userObject = {};
    userObject.account_status = statusType;
    if (statusType == 0) {
      userObject.suspended = 0;
      userObject["account_settings.pause"] = 0;
    } else if (statusType == 1) {
      userObject.deleted = 1;
    } else if (statusType == 2) {
      userObject.suspended = 1;
      userObject["account_settings.pause"] = 0;
    } else if (statusType == 3) {
      userObject["account_settings.pause"] = 1;
      userObject.suspended = 0;
    }
    var user = await User.findOne({ _id: userId, deleted: 0 });

    if (user) {
      await User.findOneAndUpdate(
        { _id: userId, deleted: 0 },
        { $set: userObject }
      );

      return res.json({
        status: 1,
        response: "successful",
        message: "Record is updated successfully",
      });
    } else {
      return res.json({
        status: 0,
        response: "error",
        message: "Record does not exists",
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

router.put(
  "/changeAccountStatus/:user_id/:status_type",
  auth,
  async (req, res) => {
    try {
      const userId = req.params.user_id;
      const statusType = req.params.status_type;

      let userObject = {};
      userObject.account_status = statusType;
      await User.findOneAndUpdate({ _id: userId }, { $set: userObject });
      var message = "Status updated successfully.";
      if (statusType == 3) {
        message = "Account archived successfully.";
      }
      return res.json({
        success: 1,
        response: "successful",
        message: message,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/",
  [
    auth,
    [
      check("previous_password", "Password is not correct").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      ),
      check(
        "new_password",
        "New password should have( one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long )"
      ).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      ),
      check(
        "confirm_password",
        "Confirm Password should matched with new password"
      ).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      ),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    var err = [];
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { previous_password, new_password, confirm_password } = req.body;

    const user = await Admin.findOne({ _id: req.user.id });
    const isMatch = await bcrypt.compare(previous_password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            status: 0,
            response: "error",
            param: "previous_password",
            msg: "Invalid previous password",
          },
        ],
      });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({
        errors: [
          {
            status: 0,
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
      let personalData = await Admin.findOneAndUpdate(
        { _id: req.user.id },
        { $set: passwordObject }
      );
      res.json({
        status: 1,
        response: "successful",
        message: "Password is updated successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/forgotPassword",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await Admin.findOne({ email: email });

      if (!user) {
        user = await Subadmin.findOne({ email: email });
      }

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              status: 0,
              response: "error",
              param: "email",
              msg: "Please use registered email",
            },
          ],
        });
      } else {
        let userID = user._id;
        // const salt = await bcrypt.genSalt(10);
        var email_verification_code = Math.floor(
          100000 + Math.random() * 900000
        );

        var otp_expired = new Date();
        otp_expired.setMinutes(otp_expired.getMinutes() + 5);
        const passwordObject = {};
        passwordObject.otp_expired = otp_expired;
        passwordObject.otp = email_verification_code;
        passwordObject.updated_at = new Date();

        try {
          let personalData = {};
          if (user.role && user.role == 2) {
            personalData = await Subadmin.findOneAndUpdate(
              { _id: user._id },
              { $set: passwordObject }
            );
          } else {
            personalData = await Admin.findOneAndUpdate(
              { _id: user._id },
              { $set: passwordObject }
            );
          }

          // Using upsert option (creates new doc if no match is found):

          // sgMail.setApiKey(sendGridAPiKey);
          // const msg = {
          //   to: 'rekha.fresco@gmail.com',
          //   //to: email,
          //   from: {
          //     email: "mentordeveloper@gmail.com",
          //     name: "Mentor Support",
          //   },
          //   subject: "Forgot Password",
          //   html:
          // '<style>.first{width:100%}</style>'+
          // '<div class="row" style="background-color:#f3f3f3;border: 3px solid #c3c3c3;">'+
          //   '<div style="text-align: center;padding:7px;">'+
          //     '<a href=' +site_url +' target="_blank" align>'+
          //       '<img src="'+site_url+'/img/group-6.png" height="auto" width="auto ">'+
          //     '</a>'+
          //   '</div>'+
          //     '<div class="col-md-12" style="padding:20px;text-align:center;font-size:20px">'+
          //       'Dear Admin <br>It seems that you forgot your password. We would like to recommend you that please change your password by clicking below button.'+
          //       '<br><br>'+
          //       '<a href="'+site_url+'/change-password/'+userID+'"> '+
          //         '<button style="cursor: pointer;font-size: 20px;background: blue;border: none;border-radius: 50px;padding: 15px;color: white;cursor: pointer;">'+
          //           'Reset Password'+
          //         '</button>'+
          //       '</a>'+
          //       '<br><br>'+
          //       `<p style="text-align:center">If you didn't request a password reset, please ignore this email and do something fun. It's a nice day.</p>`+
          //     '</div>'+
          //     // '<div class="col-md-12" style="padding:20px;font-size: 20px;">Team Rater</div>'+
          //     '<div class="row col-md-12" style="text-align:center;background-color:#c3c3c3;color:white;height: auto;padding-top: 0px;"><div class="col-md-12 first" style="text-align:center;color:white; padding-top: 0px; width:100%; margin-left:0px;">'+
          //       '<div style="margin-top:6px;margin-bottom:6px;padding-top:6px;padding: 5px;color: black;font-family: -webkit-pictograph;font-size: 14px;font-weight: 600;">'+
          //       'Copyright © 2021 Rater , All rights reserved'+
          //     '</div>'+
          //   '</div>'+
          //   // '<div class="col-md-12" style="font-size: 20px;text-align:center;color:#012132;width:100%;display:content;margin-left:0px; margin-top:0px; font-size:12px; margin-bottom: 6px;"> '+
          //   //   'Rater.'+
          //   // '</div>'+
          //   // '<div class="col-md-12" style="font-size: 20px;text-align:center;color:#012132;width:100%; font-size:12px; display:content;margin-top:0px;">'+
          //   //   'Contact : +91-7827992542'+
          //   //   '<br>Email: info@rater.com'+
          //   //   '<br>Web: www.rater.com'+
          //   // '</div>'+
          // '</div>',
          // };
          // sgMail.send(msg);
          res.json({
            success: true,
            message: "OTP send successfully",
            data: user._id,
          });
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/users/verifyOtp
// @desc     Registered user otp verification
// @access   Private
router.post(
  "/verifyOtp",
  [
    check("email", "Please include a valid email").isEmail(),
    check("otp", "OTP must be of 6 digit numbers").matches(/^[0-9]{6}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
      function diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.round(diff);
      }
      let userData = await Admin.findOne({ email: email });

      if (!userData) {
        userData = await Subadmin.findOne({ email: email });
      }
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
            userDetails.otp_expired = currentDateTime;
            if (userData.role && userData.role == 2) {
              await Subadmin.findOneAndUpdate(
                { email: email },
                { $set: userDetails }
              );
            } else {
              await Admin.findOneAndUpdate(
                { email: email },
                { $set: userDetails }
              );
            }
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

router.put(
  "/change_password",
  [
    [
      check(
        "password",
        "New password should have( one uppercase , one lower case, one special char, one digit and min 6 char long )"
      ).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      ),
      check(
        "confirm_password",
        "Confirm Password should matched with new password"
      ).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      ),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    var err = [];
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, confirm_password } = req.body;
    let userRole = 1;
    let user = await Admin.findOne({ email: email });

    if (!user) {
      user = await Subadmin.findOne({ email: email });
      userRole = 2;
    }

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            status: 0,
            response: "error",
            param: "_id",
            msg: "Something Went Wrong..",
          },
        ],
      });
    }
    if (password !== confirm_password) {
      return res.status(400).json({
        errors: [
          {
            status: 0,
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
    if (password) passwordObject.password = await bcrypt.hash(password, salt);
    if (password) passwordObject.verification_link_expire = 1;
    passwordObject.updated_at = new Date();

    try {
      let personalData = null;
      if (userRole == 1) {
        // Using upsert option (creates new doc if no match is found):
        personalData = await Admin.findOneAndUpdate(
          { email: email },
          { $set: passwordObject }
        );
      } else {
        personalData = await Subadmin.findOneAndUpdate(
          { email: email },
          { $set: passwordObject }
        );
      }
      if (personalData) {
        res.json({
          status: 1,
          response: "successful",
          message: "Password is updated successfully",
        });
      } else {
        res.json({
          status: 0,
          response: "error",
          message: "No record found",
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/reply",
  [
    check("email", "Please include a valid email").isEmail(),
    check("reply", "Required").not().isEmpty(),
    check("name", "Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, reply, name } = req.body;

    try {
      sgMail.setApiKey(sendGridAPiKey);
      const msg = {
        to: email,
        from: {
          email: "rekha.fresco@gmail.com",
          name: "College Vidya support",
        },
        subject: "Reply for Enquiry",
        html:
          '<style>.first{width:100%}</style><div class="row" style="background-color:#f3f3f3;border: 3px solid #c3c3c3;"><div style="text-align: center;background-color: #c3c3c3;padding:7px;"><a href=' +
          site_url +
          ' target="_blank" align><img src="http://13.127.226.14:3000/img/123x70.png" height="auto" width="auto "></a></div><div class="col-md-12 mt-1" style="text-align: center"><b style="font-size:18px;text-align:center"></b></div><div class="col-md-12" style="padding:20px"><br>Dear ' +
          name +
          " <br>" +
          reply +
          '</div><div class="col-md-12" style="padding:20px">Team<br>College Vidya</div><div class="row col-md-12" style="text-align:center;background-color:#c3c3c3;color:white;height: auto;padding-top: 0px;"><div class="col-md-12 first" style="text-align:center;color:white; padding-top: 0px; width:100%; margin-left:0px;"><div style="margin-top: 6px; margin-bottom:6px; padding-top: 6px;"><a href="https://www.facebook.com/frescowebservices/" target="_blank" style="display:inline-block;"><img src="https://res.cloudinary.com/riya1/image/upload/v1557393888/icons/facebook.png" alt="" width="30"></a><a href="https://www.instagram.com/fresco_web_services/" target="_blank" style="display:inline-block;"><img src="https://res.cloudinary.com/riya1/image/upload/v1557393888/icons/instagram.png" alt="" width="30"></a><a href="https://in.linkedin.com/company/fresco-web-services" target="_blank" style="display:inline-block;"><img src="https://res.cloudinary.com/riya1/image/upload/v1557393888/icons/linkedin.png" alt="" width="30"></a><a href="https://twitter.com/FrescoWebchd" target="_blank" style="display:inline-block;"><img src="https://res.cloudinary.com/riya1/image/upload/v1557393888/icons/twitter.png" alt="" width="30"></a></div></div><div class="col-md-12" style="text-align:center;color:#012132;width:100%;display:content;margin-left:0px; margin-top:0px; font-size:12px; margin-bottom: 6px;"> College Vidya.<br>Addrress: #000, Lorem,<br>Ipsum, Lorem Ipsum, Lorem,<br>Ipsum(India).</div><div class="col-md-12" style="text-align:center;color:#012132;width:100%; font-size:12px; display:content;margin-top:0px;">Contact : +91-7827992542<br>Email: info@collegevidya.com<br>Web: www.collegevidya.com</div></div>',
      };
      sgMail.send(msg);
      res.json({
        status: 1,
        response: "successful",
        message: "Reply send successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/search/:s/:pageNo", async (req, res) => {
  var s = req.params.s;
  var showPagination = [1];
  var pageNo = req.params.pageNo;
  var showData = 10;
  var removeData = (pageNo - 1) * showData;
  //var removeData = 0;
  try {
    var num1 = s;
    var user = [];
    var userDataTotal = [];
    if (isNaN(num1)) {
      user = await User.find(
        {
          $or: [
            { firstname: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
          ],
        },
        {
          firstname: 1,
          email: 1,
          phone: 1,
          age: 1,
          profile_image: 1,
          identity: 1,
          interest_in: 1,
          account_status: 1,
          deleted: 1,
          flag_raised: 1,
          created_at: 1,
        }
      )
        .skip(removeData)
        .limit(showData);
      userDataTotal = await User.find(
        {
          $or: [
            { firstname: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
          ],
        },
        { _id: 1 }
      );
    }
    // else{
    //   user = await User.find({
    //     $or: [ {"firstname" : { $regex:  s, $options: 'i' }} , {"email" : { $regex:  s, $options: 'i' } } , {"phone": /.*s.*/} ]   },
    //     {
    //       firstname: 1,
    //       email: 1,
    //       phone: 1,
    //       age: 1,
    //       profile_image: 1,
    //       identity: 1,
    //       interest_in: 1,
    //       account_status:1,
    //       deleted:1,
    //       flag_raised:1
    //     }
    //     )
    //     .skip(removeData)
    //     .limit(showData);
    //      userDataTotal = await User.find({
    //       $or: [ {"firstname" : { $regex:  s, $options: 'i' }} , {"email" : { $regex:  s, $options: 'i' } } , {"phone" : { $regex:  s, $options: 'i' } } ]   }
    //      , { _id: 1 });
    // }

    var newArray = [];
    var count = 0;
    count = Number(removeData) + Number(1);
    var totalPages = Math.ceil(userDataTotal.length / 10);
    showPagination = [1];
    if (pageNo == 1 || pageNo == 2) {
      if (totalPages == 1) {
        showPagination = [1];
      } else if (totalPages == 2) {
        showPagination = [1, 2];
      } else {
        showPagination = [1, 2, 3];
      }
    } else {
      var pre = pageNo - 1;
      var next = pageNo + Number(1);

      if (totalPages > next) {
        showPagination = [pre, pageNo, next];
      } else {
        showPagination = [pre, pageNo];
      }
    }

    for (var i = 0; i < user.length; i++) {
      var identityData = await Dropdown.findOne(
        { name: "identity" },
        { options: 1, _id: 0 }
      );
      let identityValue = user[i].identity;
      let identityName = identityData.options[identityValue];
      var lookingForData = await Dropdown.findOne(
        { name: "gender" },
        { options: 1, _id: 0 }
      );
      let lookingForValue = user[i].interest_in;
      let lookingForName = lookingForData.options[lookingForValue];
      // if(user[i].deleted == 1){
      //   var userStatus = await User.findOneAndUpdate({_id:user[i]._id},{$set:{account_status:1}});
      // }

      newArray.push({
        _id: user[i]._id,
        firstname: user[i].firstname,
        email: user[i].email,
        phone: user[i].phone,
        age: user[i].age,
        profile_image:
          user[i].profile_image.length > 0 ? user[i].profile_image[0] : "",
        identity: identityName,
        interest_in: lookingForName,
        srNo: count++,
        showPagination: showPagination,
        totalPages: 1,
        account_status: user[i].account_status,
        flag_raised: user[i].flag_raised,
        created_at: user[i].created_at,
      });
    }

    res.json({
      data: newArray,
      total: userDataTotal.length,
    });

    // res.json(
    //   user
    // );
  } catch (err) {
    console.error(err.message);

    return res.status(400).json({
      errors: [
        {
          status: 0,
          response: "error",
          msg: "No record found",
        },
      ],
    });
  }
});

router.put("/add_update_email_template_notifications", async (req, res) => {
  const errors = validationResult(req);
  var err = [];
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    notification_title,
    notification_type,
    sendgrid_template_ids,
    notification_status,
    created_at,
    updated_at,
    deleted,
    deleted_at,
    _id,
  } = req.body;
  try {
    const notificationObject = {};
    if (notification_title)
      notificationObject.notification_title = notification_title;
    if (notification_type)
      notificationObject.notification_type = notification_type;
    if (sendgrid_template_ids && sendgrid_template_ids.length > 0)
      notificationObject.sendgrid_template_ids = sendgrid_template_ids;
    notificationObject.notification_status = notification_status;
    if (created_at) notificationObject.created_at = created_at;
    if (updated_at) notificationObject.updated_at = updated_at;
    notificationObject.deleted = deleted;
    if (deleted_at) notificationObject.deleted_at = deleted_at;
    if (!_id) {
      var notification = new NotificationEmailTemplates(notificationObject);
      await notification.save();
      res.json({
        status: 1,
        response: "successful",
        message: "Notification email template saved.",
      });
    } else {
      var notification = await NotificationEmailTemplates.findOneAndUpdate(
        { _id: _id },
        { $set: notificationObject }
      );

      res.json({
        success: 1,
        response: "successful",
        message: "Notification email template updated.",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/notifications/getEmailTemplates", auth, async (req, res) => {
  try {
    const allNotifications = await NotificationEmailTemplates.find({
      deleted: 0,
    });

    res.json({
      data: allNotifications,
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/userDetailsStu", auth, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (userId == "" && userId == "") {
      return res.status(500).send("Please provide userId");
    }
    const criteria = {
      user_id: ObjectId(userId),
    };
    const recentTransactions = await Transaction.find(criteria)
      .sort({
        created_at: -1,
      })
      .limit(5);
    const recentSessions = await BookedClasses.find(criteria)
      .sort({
        created_at: -1,
      })
      .limit(5)
      .populate("class_id", "class_id type_of_class session_type");
    let totalSpent = await Transaction.aggregate([
      {
        $match: {
          user_id: ObjectId(userId),
        },
      },
      {
        $group: {
          _id: 1,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    totalSpent = totalSpent.length > 0 ? totalSpent[0].totalAmount : 0;
    const sessionsAttended = await BookedClasses.countDocuments({
      user_id: ObjectId(userId),
      session_progress_status: {
        $in: [1, 2],
      },
    });
    //  user_role: 1 for student and 2 for teacher
    const ratingDataStudent = await BookedClasses.aggregate([
      {
        $match: {
          user_id: ObjectId(userId),
          rating: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: 1,
          averageRating: {
            $avg: "$rating",
          },
          totalRatingCount: {
            $sum: 1,
          },
        },
      },
    ]);
    let totalRatingCount =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].totalRatingCount : 0;
    let averageRating =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].averageRating : 0;

    // const userData = await User.findById(req.query.userId, {
    //   expertise: 1,
    //   about_expertise: 1,
    //   language: 1,
    //   profile_image: 1,
    //   first_name: 1,
    //   last_name: 1
    // })
    // const classData = await Classes.find({},{class_title: 1, session_type: 1, price: 1}).limit(5)
    //     //  user_role: 1 for student and 2 for teacher

    res.json({
      data: {
        recentTransactions,
        recentSessions,
        sessionsAttended,
        totalSpent,
        totalRatingCount,
        averageRating,
        userData,
        classData,
      },
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/userDetailsTeach", auth, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (userId == "") {
      return res.status(400).send("Please provide userId");
    }
    const criteria = {
      user_id: ObjectId(userId),
    };
    // const recentTransactions = await Payouts.find(criteria)
    //   .sort({
    //     created_at: -1,
    //   })
    //   .limit(5);

    const recentSessions = await classDetailsSchema
      .find({ created_by: userId })
      .sort({
        created_at: -1,
        class_session_date: 1,
      })
      .limit(5)
      .populate("class_id", "class_id type_of_class session_type");
    let totalSpent = await Transaction.aggregate([
      {
        //   $match : {
        //     userId : ObjectId(req.query.userId)
        //   }
        // },{
        $group: {
          _id: 1,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    totalSpent = totalSpent.length > 0 ? totalSpent[0].totalAmount : 0;
    //  user_role: 1 for student and 2 for teacher
    //tehrUser
    const sessionsHostedTeacher = await classDetailsSchema.countDocuments({
      created_by: userId,
      session_progress_status: {
        $in: [1, 2],
      },
    });
    const userData = await User.findById(userId, {
      expertise: 1,
      about_expertise: 1,
      language: 1,
      profile_image: 1,
      first_name: 1,
      last_name: 1,
    });
    const classData = await classDetailsSchema
      .find({ created_by: userId }, { class_title: 1 })
      .populate("class_id", { session_type: 1, price: 1 })
      .limit(5);
    //  user_role: 1 for student and 2 for teacher
    const ratingDataTeacher = await TeachersRating.aggregate([
      {
        $match: {
          rating_given_to : ObjectId(userId),
          rating: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: 1,
          averageRating: {
            $avg: "$rating",
          },
          totalRatingCount: {
            $sum: 1,
          },
        },
      },
    ]);
    let totalRatingCount =
      ratingDataTeacher.length > 0 ? ratingDataTeacher[0].totalRatingCount : 0;
    let averageRating =
      ratingDataTeacher.length > 0 ? ratingDataTeacher[0].averageRating : 0;

    res.json({
      data: {
        recentTransactions : [],
        recentSessions,
        totalSpent,
        totalRatingCount,
        averageRating,
        userData,
        classData,
        sessionsHostedTeacher,
      },
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/userDetails", auth, async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) - 1 : 0;
    const limit = Number(req.query.limit) || 10;
    const userId = req.query.userId;
    if (userId == "" && userId == "") {
      return res.status(500).send("Please provide userId");
    }
    const criteria = {
      userid: ObjectId(userId),
    };
    const recentTransactions = await Transaction.find(criteria)
      .sort({
        created_at: -1,
      })
      .limit(5);
    const recentSessions = await BookedClasses.find(criteria)
      .sort({
        created_at: -1,
      })
      .limit(5)
      .populate("class_id", "class_id type_of_class session_type");
    let totalSpent = await Transaction.aggregate([
      {
        $match: {
          userId: ObjectId(userId),
        },
      },
      {
        $group: {
          _id: 1,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    totalSpent = totalSpent.length > 0 ? totalSpent[0].totalAmount : 0;
    const sessionsAttended = await BookedClasses.countDocuments({
      userId: ObjectId(userId),
      session_progress_status: {
        $in: [1, 2],
      },
    });
    //  user_role: 1 for student and 2 for teacher
    const ratingDataStudent = await StudentsRating.aggregate([
      {
        $match: {
          userId: ObjectId(userId),
          rating: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: 1,
          averageRating: {
            $avg: "$rating",
          },
          totalRatingCount: {
            $sum: 1,
          },
        },
      },
    ]);
    let totalRatingCount =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].totalRatingCount : 0;
    let averageRating =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].averageRating : 0;
    //tehrUser
    const sessionsHostedTeacher = await BookedClasses.countDocuments({
      userId: ObjectId(userId),
      session_progress_status: {
        $in: [1],
      },
    });
    const userData = await User.findById(req.query.userId, {
      expertise: 1,
      about_expertise: 1,
      language: 1,
      profile_image: 1,
      first_name: 1,
      last_name: 1,
    });
    const classData = await classDetailsSchema
      .find(
        {},
        {
          class_title: 1,
        }
      )
      .limit(5)
      .populate("class_id", "class_id session_type price");
    //  user_role: 1 for student and 2 for teacher
    const ratingDataTeacher = await TeachersRating.aggregate([
      {
        $match: {
          userId: ObjectId(userId),
          rating: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: 1,
          averageRatingTeacher: {
            $avg: "$rating",
          },
          totalRatingCount: {
            $sum: 1,
          },
        },
      },
    ]);
    let totalRatingCountT =
      ratingDataTeacher.length > 0 ? ratingDataTeacher[0].totalRatingCount : 0;
    let averageRatingTeacher =
      ratingDataTeacher.length > 0
        ? ratingDataTeacher[0].averageRatingTeacher
        : 0;
    res.json({
      data: {
        recentTransactions,
        recentSessions,
        sessionsAttended,
        totalSpent,
        totalRatingCount,
        averageRating,
        userData,
        classData,
        sessionsHostedTeacher,
        totalRatingCountT,
        averageRatingTeacher,
      },
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getUserStudentDetailById", auth, async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) - 1 : 0;
    const limit = Number(req.query.limit) || 10;
    const userId = req.query.userId;
    if (userId == "") {
      return res.status(500).send("Please provide userId");
    }
    const criteria = {
      user_id: ObjectId(userId),
    };
    const recentTransactions = await Transaction.find(criteria)
      .sort({
        created_at: -1,
      })
      .limit(5);
    const recentSessions = await BookedClasses.find({
      booked_by: ObjectId(userId),
    })
      .sort({
        created_at: -1,
      })
      .limit(5)
      .populate("class_id", "class_id type_of_class session_type");
    let totalSpent = await Transaction.aggregate([
      {
        $match: {
          user_id: ObjectId(userId),
        },
      },
      {
        $group: {
          _id: 1,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    totalSpent = totalSpent.length > 0 ? totalSpent[0].totalAmount : 0;
    const sessionsAttended = await BookedClasses.countDocuments({
      booked_by: ObjectId(userId),
      session_progress_status: {
        $in: [1, 2],
      },
    });
    //  user_role: 1 for student and 2 for teacher
    const ratingDataStudent = await BookedClasses.aggregate([
      {
        $match: {
          booked_by: ObjectId(userId),
          rating: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: 1,
          averageRating: {
            $avg: "$rating",
          },
          totalRatingCount: {
            $sum: 1,
          },
        },
      },
    ]);
    let totalRatingCount =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].totalRatingCount : 0;
    let averageRating =
      ratingDataStudent.length > 0 ? ratingDataStudent[0].averageRating : 0;

    return res.json({
      data: {
        recentTransactions,
        recentSessions,
        sessionsAttended,
        totalSpent,
        totalRatingCount,
        averageRating,
      },
      message: "Data fetched successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/createUser",
  [
    // check('phone', 'Please enter valid phone number')
    //   .matches(/^(?=.*[0-9])(?=.{10,10})/),
    // check(
    //   'password',
    //   'Please enter a password with 8 or more characters'
    // ).isLength({ min: 8}),
    // check(
    //   'confirm_password',
    //   'Confirm password does not matched with password.'
    // ).isLength({ min: 8}),
    check("first_name", "Firstname is required").not().isEmpty(),
    check("gender", "Please select gender").matches(/^[0-9]+$/),
    check("dob", "Date of birth is required").not().isEmpty(),
    check(
      "user_role",
      "User role is required (1 for student and 2 for teacher and 3 for admin)"
    )
      .not()
      .isEmpty(),
    check("account_status", "Account status is required.").not().isEmpty(),
    // check(
    //   'accept_terms_and_conditions',
    //   'Please accept terms and conditions'
    // ).not()
    // .isEmpty()
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
      email,
      edit,
      password,
      _id,
      //confirm_password,
      user_role,
      account_status,
      first_name,
      last_name,
      gender,
      dob,
      street_address,
      city,
      state,
      zip_code,
      age,
      language,
      topics,
      expertise,
      about_expertise,
      planned_topics,
      tags,
      profile_image,
      reset_password,
      intro_video,
      //accept_terms_and_conditions
    } = req.body;

    try {
      var userDetails = {};
      var messageForOutput = "Account created successfully.";
      var search = { phone: phone, account_verified: 1, deleted: 0 };
      var msg = "Phone number already exists.";
      var param = "phone";
      const salt = await bcrypt.genSalt(10);

      if (user_role == 3) {
        search = { email: email, account_verified: 1, deleted: 0 };
        msg = "Email already exists.";
        param = "email";
      }
      if (!edit) {
        console.log(edit);
        let user = await User.findOne(search);
        if (user) {
          return res.status(400).json({
            success: false,
            errors: [
              {
                response: "error",
                param: param,
                msg: msg,
              },
            ],
          });
        }
        var deleted = 0;
        var created_at = new Date();
        var account_verified = 1;

        userDetails.phone = phone;
        userDetails.email = email;
        userDetails.profile_created = true;
        userDetails.deleted = deleted;
        userDetails.password = await bcrypt.hash(password, salt);
        userDetails.user_role = user_role;
        userDetails.created_at = created_at;
        userDetails.accept_terms_and_conditions = 1;
        userDetails.user_created_by_admin = 1;
        userDetails.account_verified = account_verified;
      }
      if (edit) {
        if (reset_password) {
          userDetails.password = await bcrypt.hash(password, salt);
        }
        messageForOutput = "Account updated successfully.";
      }

      userDetails.account_status = account_status;
      userDetails.first_name = first_name;
      userDetails.last_name = last_name;
      userDetails.gender = gender;
      userDetails.dob = dob;
      userDetails.age = age;
      userDetails.street_address = street_address;
      userDetails.city = city;
      userDetails.state = state;
      userDetails.zip_code = zip_code;
      userDetails.language = language;
      userDetails.updated_at = new Date();
      if (profile_image && profile_image != "") {
        userDetails.profile_image = profile_image;
      }
      if (edit) {
        user = await User.findOneAndUpdate(
          { _id: _id },
          { $set: userDetails }
          //{new:true,upsert:true}
        );
      } else {
        user = await User.findOneAndUpdate(
          search,
          { $set: userDetails },
          { new: true, upsert: true }
        );
      }

      res.json({
        success: true,
        message: messageForOutput,
        // data: {
        //   id: user.id,
        //   profile:{
        //     phone: user.phone
        //   }
        // }
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

router.get(
  "/getAllSessions",
  //auth,
  async (req, res) => {
    try {
      const { page } = req.query;
      var pageNumber = 1;
      if (page) {
        pageNumber = page;
      }
      var limit = 10;
      var skip = (pageNumber - 1) * limit;
      // var result = await classDetailsSchema.find().populate('created_by',{
      //   first_name : 1,
      //   last_name : 1
      // }).populate('class_id',{
      //   class_title:1,
      //   enrolled_students:1,
      //   type_of_class : 1,
      //   session_type : 1,

      // }).skip(skip).limit(limit);
      var classData = await classDetailsSchema.aggregate([
        {
          $lookup: {
            from: "classes",
            localField: "class_id",
            foreignField: "_id",
            as: "classes",
          },
        },
        {
          $unwind: "$classes",
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
          $unwind: "$users",
        },
        //{$match:searchQuery},
        {
          $project: {
            "users.first_name": 1,
            "users.last_name": 1,
            "classes.class_title": 1,
            "classes.enrolled_students": 1,
            "classes.type_of_class": 1,
            "classes.session_type": 1,
            class_date: 1,
            start_time_of_class: 1,
            end_time_of_class: 1,
            session_progress_status: 1,
            payout_status: 1,
          },
        },
        { $limit: limit },
        { $skip: skip },
      ]);
      res.json({
        success: true,
        message: "Data fetched successfully.",
        data: classData,
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

// @route    POST /v1/teacherListingForPayout --  Need to update -pending
// @desc     Check for teaher payoutListing // Need to update -pending
// @access   Private
router.get("/teacherListingForPayout/:pageNo", auth, async (req, res) => {
  try {
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };
    const totalCount = await User.count({
      account_status: { $ne: 0 },
      user_role: 2,
    });
    const data = await User.find({
      account_status: { $ne: 0 },
      user_role: 2,
    })
      .sort(sortData)
      .skip(removeData)
      .limit(showData);

    if (data.length == 0) {
      return res.status(200).json({
        success: false,
        errors: [
          {
            response: "error",
            msg: "No record found",
          },
        ],
      });
    }

    res.json({
      success: true,
      msg: "Record found",
      data: {
        totalCount: totalCount,
        users: data,
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

// @route    POST /v1/addCommissionRate
// @desc    Add some commision Rate
// @access   Private
router.post(
  "/addCommissionRate",
  auth,
  [
    check("payout_commission", "Payour commsion required").not().isEmpty(),
    check("refund_commission", "Refund commsion required").not().isEmpty(),
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

      const { payout_commission, refund_commission } = req.body;

      const updateData = {
        payout_commission: payout_commission,
        refund_commission: refund_commission,
        user_id: req.user.id,
      };

      const saveCommission = await Commission.findOneAndUpdate(
        {
          payout_commission: { $exists: true },
          refund_commission: { $exists: true },
        },
        {
          $set: updateData,
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.json({
        success: true,
        msg: "Record updated",
        data: saveCommission,
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

// @route    Get /v1/addCommissionRate
// @desc     Get the commission detail
// @access   Private
router.get("/getCommissionRate", auth, async (req, res) => {
  try {
    const saveCommission = await Commission.findOne({
      payout_commission: { $exists: true },
      refund_commission: { $exists: true },
    });
    if (!saveCommission) {
      res.status(400).json({
        success: false,
        errors: [
          {
            msg: "No record found",
          },
        ],
      });
    }

    res.json({
      success: true,
      msg: "Record found",
      data: saveCommission,
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

// @route    Get /v1/payoutListing
// @desc     payoutList for admin
// @access   Private
router.get("/payoutListing/:pageNo", auth, async (req, res) => {
  try {
    const pageNo = req.params.pageNo;
    const showData = 10;
    const removeData = (pageNo - 1) * showData;
    const sortData = { created_at: -1 };

    const data = await Classes.aggregate([
      {
        $match: {
          session_progress_status: 2,
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
                session_progress_status: 2,
              },
            },
            {
              $project: {
                _id: 1,
                booked_by: 1,
                class_id: 1,
                session_id: 1,
                transaction_id: 1,
                created_by: 1,
                class_title: 1,
                booking_status: 1,
              },
            },
          ],
          as: "bookingDetails",
        },
      },
    ]);

    if (data.length == 0) {
      res.status(400).json({
        success: false,
        errors: [
          {
            msg: "No record found",
          },
        ],
      });
    }
    res.json({
      success: true,
      msg: "Record found",
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

// router.put('/updateClassDetailRuff' , async(req ,res) => {
//   try {
//    const data =  await Classes.updateMany(
//       {
//         _id:  {$exists : true}
//       },
//       {
//       $set:
//       {
//         paid_status:0
//       }
//       },
//       {
//         new : true
//       }
//     );

//     res.json({
//       msg : "update success",
//       data : data
//     })
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
// })

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

// @route    GET v1/users/getPayoutsRecordsForOnDemand
// @desc     show payouts for On-demand
// @access   Private
router.get("/getPayoutsRecordsForOnDemand", auth, async (req, res) => {
  try {
    const commissionAmount = await Commission.findOne();
    var searchQuery = {};
    // searchQuery["$or"] = [
    //   { "session_progress_status": 1 },
    //   { "session_progress_status": 2 },
    // ];
    searchQuery["classes.enrolled_students"] = {
      $gt: 0,
    };
    searchQuery["classes.type_of_class"] = 1;
    var data = await classDetailsSchema.aggregate([
      //[
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $match: {
          $or: [
            { class_session_date: { $lte: new Date() } },
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
          from: "booked_classes",
          localField: "_id",
          foreignField: "session_id",
          pipeline: [
            {
              $project: {
                transaction_id: 1,
              },
            },
          ],
          as: "booked_classes",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "booked_classes.transaction_id",
          foreignField: "_id",
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
        $unwind: "$transactions",
      },
      {
        $project: {
          class_title: 1,
          session_progress_status: 1,
          class_session_date: 1,
          teacherDetail: 1,
          transactions: 1,
          booked_classes: 1,
          totalAmount: "$transactions.amount",
          platformFee: {
            $ifNull: [
              {
                $multiply: [
                  "$transactions.amount",
                  { $divide: [commissionAmount.payout_commission, 100] },
                ],
              },
              0,
            ],
          },
          platformFeeInPercentage: {
            $divide: [commissionAmount.payout_commission, 1],
          },
          earning: {
            $ifNull: [
              {
                $subtract: [
                  "$transactions.amount",
                  {
                    $multiply: [
                      "$transactions.amount",
                      { $divide: [commissionAmount.payout_commission, 100] },
                    ],
                  },
                ],
              },
              0,
            ],
          },
        },
      },
      // {
      //   $project: {
      //     class_title: 1,
      //     cover_image: 1,
      //     type_of_class: 1,
      //     session_type: 1,
      //     price: 1,
      //     max_students_allowed: 1,
      //     enrolled_students: 1,
      //     location: 1,
      //     platformFee: {
      //       $ifNull: [
      //         {
      //           $multiply: [
      //             {
      //               $sum: {
      //                 $multiply: ["$price", "$totalEnrollment"],
      //               },
      //             },
      //             { $divide: [commissionAmount.payout_commission, 100] },
      //           ],
      //         },
      //         0,
      //       ],
      //     },
      //     platformFeeInPercentage: {
      //       $divide: [commissionAmount.payout_commission, 1],
      //     },
      //     address_or_class_link: {
      //       $ifNull: ["$address_or_class_link", "Online"],
      //     },
      //     "class_details.session_progress_status": 1,
      //     "class_details._id": 1,
      //     teacherDetail: 1,
      //     totalAmount: { $sum: "$transactions.amount" },
      //     earning: {
      //       $ifNull: [
      //         {
      //           $subtract: [
      //             {
      //               $sum: "$transactions.amount",
      //             },
      //             {
      //               $multiply: [
      //                 { $sum: "$transactions.amount" },
      //                 { $divide: [commissionAmount.payout_commission, 100] },
      //               ],
      //             },
      //           ],
      //         },
      //         0,
      //       ],
      //     },
      //     amountPerSession: {
      //       $ifNull: [
      //         {
      //           $divide: [
      //             {
      //               $subtract: [
      //                 {
      //                   $sum: "$transactions.amount",
      //                 },
      //                 {
      //                   $multiply: [
      //                     { $sum: "$transactions.amount" },
      //                     {
      //                       $divide: [commissionAmount.payout_commission, 100],
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //             { $size: "$class_details" },
      //           ],
      //         },
      //         0,
      //       ],
      //     },
      //     transactions: { $size: ["$transactions"] },
      //   },
      // },
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

// @route    GET v1/users/getPayoutsRecordsCombined
// @desc     show payouts
// @access   Private
router.get("/getPayoutsRecordsCombined", async (req, res) => {
  try {
    var { page, start_date, end_date, class_title_or_teacher_name, payout_status, user_id, session_id } = req.query;
    var pageNo = 1;
    if (page) {
      pageNo = page;
    }
    var limit = 10;
    var skip = (pageNo - 1) * limit;
    var searchQuery = {};
    searchQuery["total_amount"] = {
      $gt: 0,
    };
    if (start_date && end_date) {
      searchQuery["$and"] = [
        { payout_start_date: { $gte: new Date(start_date) } },
        { payout_start_date: { $lte: new Date(end_date) } },
      ];
    }
    if (class_title_or_teacher_name && class_title_or_teacher_name.trim() != "") {
      searchQuery["$or"] = [
        {
          "teacherDetail.first_name": { $regex: class_title_or_teacher_name.trim(), $options: "i" },
        },
        {
          "classes.class_title": { $regex: class_title_or_teacher_name.trim(), $options: "i" },
        },
      ];
    }
    if(user_id && user_id != ""){
      searchQuery["class_created_by"] = ObjectId(user_id);
    }
    if(session_id && session_id != ""){
      searchQuery["session_ids"] = [ObjectId(session_id)];

    }
    if (payout_status && payout_status == 0) {
      searchQuery["$or"] = [
        { is_payout_detail_exists: false },
        { "payout_details.payout_status": 0 },
      ];
    } else if (payout_status == 1 || payout_status == 2) {
      searchQuery["payout_details.payout_status"] =
        parseInt(payout_status);
    }
    var totalRecords = await Payouts.aggregate([
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      
      // {
      //   $unwind: "$payout_details",
      // },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },

      {
        $lookup: {
          from: "users",
          localField: "class_created_by",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                first_name: { $ifNull: ["$first_name", ""] },
              },
            },
          ],
          as: "teacherDetail",
        },
      },

      {
        $unwind: "$teacherDetail",
      },
      {
        $match : searchQuery
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    var dataOfTransactions = await Payouts.aggregate([
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      // {
      //   $unwind: "$payout_details",
      // },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },

      {
        $lookup: {
          from: "users",
          localField: "class_created_by",
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
        $unwind: "$teacherDetail",
      },
      {
        $match : searchQuery
      },
      {
        $project: {
          class_title: {
            $ifNull: ["$classes.class_title", ""],
          },
          class_id: { $ifNull: ["$classes._id", ""] },
          first_name: { $ifNull: ["$teacherDetail.first_name", ""] },
          last_name: { $ifNull: ["$teacherDetail.last_name", ""] },
          profile_image: { $ifNull: ["$teacherDetail.profile_image", ""] },
          teacher_id: { $ifNull: ["$teacherDetail._id", ""] },
          total_amount: 1,
          platform_fee: 1,
          platform_fee_percentage: 1,
          earning: 1,
          payout_start_date: 1,
          payout_details:1
        },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.json({
      success: true,
      message: "Record fetched successfully",
      data: {
        records: dataOfTransactions,
        totalRecords: totalRecords.length,
        searchQuery
      }
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

// @route    GET v1/users/getPayoutsRecordsCombined
// @desc     show payouts
// @access   Private
router.get("/getPayoutDetail/:payoutId", async (req, res) => {
  try {
    var payout_id = req.params.payoutId;

    var searchQuery = {};
    searchQuery["total_amount"] = {
      $gt: 0,
    };
    var dataOfTransactions = await Payouts.aggregate([
      {
        $match: {
          _id: ObjectId(payout_id),
        },
      },
      {
        $lookup: {
          from: "payout_details",
          localField: "_id",
          foreignField: "payout_id",
          as: "payout_details",
        },
      },
      // {
      //   $unwind: "$payout_details",
      // },
      {
        $lookup: {
          from: "classes",
          localField: "class_id",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $lookup: {
          from: "class_details",
          localField: "session_ids",
          foreignField: "_id",
          as: "class_details",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "class_booked_by",
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
          as: "booked_by",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "class_created_by",
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
        $unwind: "$teacherDetail",
      },
      {
        $project: {
          class_title: {
            $ifNull: ["$classes.class_title", ""],
          },
          class_id: { $ifNull: ["$classes._id", ""] },
          class_price: { $ifNull: ["$classes.price", 0] },
          session_type: { $ifNull: ["$classes.session_type", 1] },
          type_of_class: { $ifNull: ["$classes.type_of_class", 1] },
          class_details: 1,
          booked_by: 1,
          first_name: { $ifNull: ["$teacherDetail.first_name", ""] },
          last_name: { $ifNull: ["$teacherDetail.last_name", ""] },
          profile_image: { $ifNull: ["$teacherDetail.profile_image", ""] },
          teacher_id: { $ifNull: ["$teacherDetail._id", ""] },
          total_amount: 1,
          platform_fee: 1,
          platform_fee_percentage: 1,
          earning: 1,
          payout_start_date: { $dateToString: { format: "%Y-%m-%d", date: "$payout_start_date" } },
          payout_status : { $ifNull : ["$payout_details.payout_status",0]},
          payout_feedback : { $ifNull : ["$payout_details.payout_feedback",""]},
          paid_amount : { $ifNull : ["$payout_details.paid_amount",0]},
        },
      },
    ]);

    res.json({
      success: true,
      message: "Record fetched successfully",
      data: dataOfTransactions,
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

// @route    GET v1/users/updatePayoutStatus
// @desc     show payouts
// @access   Private
router.put("/updatePayoutStatus", auth, async (req, res) => {
  try {
    const {
      payout_id,
      admin_type,
      paid_amount,
      payout_status,
      payout_feedback,
      class_id,
    } = req.body;
    var checkPayoutExists = await PayoutsDetails.findOne({
      payout_id: payout_id,
    });
    var dataObject = {};

    if (checkPayoutExists) {
      dataObject.updated_at = new Date();
    } else {
      dataObject.created_at = new Date();
    }
    dataObject.payout_id = payout_id;
    dataObject.paid_amount = paid_amount;
    dataObject.payout_status = payout_status;
    dataObject.payout_feedback = payout_feedback;
    dataObject.admin_type = admin_type;
    dataObject.deleted = 0;
    if (admin_type == 1) {
      dataObject.admin_id = req.user.id;
    } else if (admin_type == 2) {
      dataObject.subadmin_id = req.user.id;
    }
    const updateSessionPayout = await PayoutsDetails.findOneAndUpdate(
      {
        payout_id: payout_id,
      },
      {
        $set: dataObject,
      },
      {
        new: true,
        upsert: true,
      }
    );
    const updatePayoutsFlag = await Payouts.findOneAndUpdate(
      {
        _id: payout_id,
      },
      {
        $set: { is_payout_detail_exists: true },
      }
    );
    var classData = await Classes.findOne(
      {
        _id: class_id,
      },
      { class_title: 1, created_by: 1 }
    );

    ///////////////////////////////
    ////manage notification////////
    //////////////////////////////
    if (payout_status == 1 || payout_status == 2) {
      var SendableMessage = ``;
      var SendableTitle = "";
      var notificationType = 0;
      if (payout_status == 1) {
        SendableTitle = "Payout Released";
        SendableMessage = `We transfered $${paid_amount} to your account re: ${classData.class_title} class`;
        notificationType = config.NotificationTypeForPayoutRelease;
      } else if (payout_status == 2) {
        SendableTitle = "Payout Cancelled";
        SendableMessage = `We have cancelled the payout release of ${classData.class_title} class because of reason : ${payout_feedback}`;
        notificationType = config.NotificationTypeForCancelPayout;
      }
      const notificationObject = {
        body: SendableMessage,
        title: SendableTitle,
        contents: SendableMessage,
      };
      var result = await Helper.SendNotification(
        [classData.created_by],
        notificationObject,
        config.PAYOUTSRELEASED
      );
      const listingNotification = new Notifications({
        notification_title: SendableTitle,
        notification_msg: SendableMessage,
        action_by: req.user.id,
        notify_to: classData.created_by,
        notification_type: notificationType,
        class_id: class_id,
        created_at: new Date(),
      });

      await listingNotification.save();
    }
    ///////End save Notification//////////////

    res.json({
      success: true,
      message: "Record updated successfully",
      data: updateSessionPayout,
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

router.get("/getRefundRequestList", auth, async (req, res) => {
  try {
    const { page, start_date, end_date, class_title_or_teacher_name, refund_status } = req.query;
    var pageNo = 1;
    if (page) {
      pageNo = page;
    }
    var limit = 10;
    var skip = (pageNo - 1) * limit;
    var searchQuery = {};
    if (start_date && end_date) {
      searchQuery["$and"] = [
        { created_at: { $gte: new Date(start_date) } },
        { created_at: { $lte: new Date(end_date) } },
      ];
    }
    if (class_title_or_teacher_name && class_title_or_teacher_name.trim() != "") {
      searchQuery["$or"] = [
        {
          "users.first_name": { $regex: class_title_or_teacher_name.trim(), $options: "i" },
        },
        {
          "classes.class_title": { $regex: class_title_or_teacher_name.trim(), $options: "i" },
        },
      ];
    }
    if (refund_status == 0 || refund_status == 1 || refund_status == 2) {
      searchQuery["refund_status"] =
        parseInt(refund_status);
    }
    var totalRecords = await RefundRequests.aggregate([
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
          from: "users",
          localField: "class_booked_by",
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
          as: "users",
        },
      },

      {
        $unwind: "$users",
      },
      { $sort: { created_at: -1 } },
      {
        $match : searchQuery
      },
      {
        $project : {
          _id : 1
        }
      }
    ]);
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
        $lookup: {
          from: "users",
          localField: "class_booked_by",
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
          as: "users",
        },
      },

      {
        $unwind: "$users",
      },
      { $sort: { created_at: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $match : searchQuery
      }
      // {
      //   $group: {
      //     _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
      //     items: {
      //       $push: "$$ROOT",
      //     },
      //   },
      // },
    ]);
    return res.json({
      success: true,
      msg: "Record fetched successfully",
      data: {
        records: checkRequestExistsOfNot,
        totalRecords: totalRecords.length,
      }
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

router.get("/refundDetail/:transaction_id", auth, async (req, res) => {
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
    })
      .populate("class_id")
      .populate("transaction_id", { invoice_data: 0 })
      .populate("class_created_by");
    if (checkRequestExistsOfNot) {
      return res.json({
        success: true,
        data: checkRequestExistsOfNot,
        msg: "Record fetched successfully.",
      });
    } else {
      return res.json({
        success: false,
        msg: "No record found",
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

// @route    GET v1/users/updateRefundStatus
// @desc     show payouts
// @access   Private
router.put(
  "/updateRefundStatus",
  auth,
  [
    check("transaction_id", "Transaction id is required").not().isEmpty(),
    check("refund_feedback_by_admin", "Please provide a feedback for refund")
      .not()
      .isEmpty(),
    check("admin_type", "Please provide admin type").not().isEmpty(),
    check("refund_status", "Please provide refund status").not().isEmpty(),
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
      const {
        transaction_id,
        refund_status,
        admin_type,
        refund_amount,
        refund_feedback_by_admin,
      } = req.body;
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
      var checkRefundRequestAlreadyUpdatedOrNot = await RefundRequests.findOne({
        transaction_id: transaction_id,
        refund_status: { $gt: 0 },
      });
      if (checkRefundRequestAlreadyUpdatedOrNot) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              msg: "Action is already taken on this request.",
            },
          ],
        });
      }
      if(transactionRecord.amount < refund_amount && refund_status == 1){
        return res.status(400).json({
          success: false,
          errors: [
            {
              msg: "Refund amount must be less than or equal to paid amount.",
            },
          ],
        });
      }
      if(refund_amount < 0 && refund_status == 1){
        return res.status(400).json({
          success: false,
          errors: [
            {
              msg: "Refund amount must be greater than 0",
            },
          ],
        });
      }
      var refundObject = {};
      refundObject.transaction_id = transaction_id;
      refundObject.refund_status = refund_status;
      refundObject.refund_feedback_by_admin = refund_feedback_by_admin;
      refundObject.refund_action_taken_date = new Date();
      refundObject.refund_amount = refund_amount;
      refundObject.admin_type = admin_type;
      if (admin_type == 1) {
        refundObject.admin_id = req.user.id;
      } else if (admin_type == 2) {
        refundObject.subadmin_id = req.user.id;
      }
      const updateSessionRefund = await RefundRequests.findOneAndUpdate(
        {
          transaction_id: transaction_id,
        },
        {
          $set: refundObject,
        }
      );
      var classData = await BookedClasses.findOne(
        {
          transaction_id: transaction_id,
        },
      ).populate('class_id',{ class_title: 1, created_by: 1 });

      ///////////////////////////////
      ////manage notification////////
      //////////////////////////////
      if (refund_status == 1 || refund_status == 2) {
        var SendableMessage = ``;
        var SendableTitle = "";
        var notificationType = 0;
        if (refund_status == 1) {
          SendableTitle = "Refund Issued";
          SendableMessage = `We transfered $${refund_amount} to your account re: ${classData?.class_id?.class_title} class`;
          notificationType = config.NotificationTypeForRefundRelease;
        } else if (refund_status == 2) {
          SendableTitle = "Refund Request Cancelled";
          SendableMessage = `We have cancelled the refund request of ${classData?.class_id?.class_title} class because of reason : ${refund_feedback_by_admin}`;
          notificationType = config.NotificationTypeForCancelRefund;
        }
        const notificationObject = {
          body: SendableMessage,
          title: SendableTitle,
          contents: SendableMessage,
        };
        var result = await Helper.SendNotification(
          [updateSessionRefund.class_booked_by],
          notificationObject,
          config.REFUNDNOTIFICATIONFORSTUDENT
        );
        const listingNotification = new Notifications({
          notification_title: SendableTitle,
          notification_msg: SendableMessage,
          action_by: req.user.id,
          notify_to: updateSessionRefund.class_booked_by,
          notification_type: notificationType,
          class_id: transaction_id,
          created_at: new Date(),
        });

        await listingNotification.save();
      }
      ///////End save Notification//////////////

      res.json({
        success: true,
        message: "Record updated successfully",
        data: updateSessionRefund,
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
module.exports = router;
