const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../../middleware/auth");
const Transaction = require("../../../models/Transaction");
const User = require("../../../models/UserLogin");
var ObjectId = require("mongodb").ObjectID;
const classDetailsSchema = require("../../../models/ClassDetails");

//transactions list
router.post("/:pageNo", async (req, res) => {
  try {
    const { user_id, username, start_date, end_date, class_id } = req.body;

    var pageNo = req.params.pageNo;
    var showData = 10;
    var removeData = (pageNo - 1) * showData;
    var search = {};
    if (user_id && user_id != "") {
      search["user_id"] = user_id;
    }
    if (class_id && class_id != "") {
      search["class_id"] = class_id;
    }
    if (username && username.trim() != "") {
      search["$or"] = [
        {
          "invoice_data.user_name": { $regex: username.trim(), $options: "i" },
        },
        { transaction_id: username.trim() },
      ];
      // search['invoice_data.user_name'] = { $regex: username.trim(), $options: "i" }
    }
    // if(transaction_id && transaction_id.trim() != ''){
    //   search['transaction_id'] = transaction_id.trim();
    // }
    if (start_date && end_date) {
      search["$and"] = [
        { billing_date: { $gte: start_date } },
        { billing_date: { $lte: end_date } },
      ];
    }

    var allTransactions = await Transaction.find(search, {
      _id: 1,
      //invoice_data: 1,
      //transaction_id: 1,
    })
    //.populate("user_id", { first_name: 1, last_name: 1, profile_image: 1 });

    var transactionsData = await Transaction.find(search, {
      _id: 1,
      invoice_data: 1,
      transaction_id: 1,
    })
      .populate("user_id", { first_name: 1, last_name: 1, profile_image: 1 })
      .skip(removeData)
      .limit(showData);

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: transactionsData,
      totalTransactions:
        allTransactions.length != 0
          ? Math.ceil(allTransactions.length / showData)
          : 0,
      allData: allTransactions,
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

router.post("/payouts/:pageNo", async (req, res) => {
  try {
    console.log('apihit');
    const { user_id, username, start_date, end_date, class_id } = req.body;

    var pageNo = req.params.pageNo;
    var showData = 10;
    var removeData = (pageNo - 1) * showData;
    var search = {
      session_progress_status : 2
    };
    // if (user_id && user_id != "") {
    //   search["user_id"] = user_id;
    // }
    // if (class_id && class_id != "") {
    //   search["class_id"] = class_id;
    // }
    // if (username && username.trim() != "") {
    //   search["$or"] = [
    //     {
    //       "invoice_data.user_name": { $regex: username.trim(), $options: "i" },
    //     },
    //     { transaction_id: username.trim() },
    //   ];
    // }
    // if(transaction_id && transaction_id.trim() != ''){
    //   search['transaction_id'] = transaction_id.trim();
    // }
    // if (start_date && end_date) {
    //   search["$and"] = [
    //     { billing_date: { $gte: start_date } },
    //     { billing_date: { $lte: end_date } },
    //   ];
    // }

    var allPayouts = await classDetailsSchema.find(search, {
      _id: 1,
      //invoice_data: 1,
      //transaction_id: 1,
    })
    console.log(allPayouts);
    //.populate("user_id", { first_name: 1, last_name: 1, profile_image: 1 });
    var payoutsData = await classDetailsSchema.aggregate([
      { 
        $lookup:
        {
           from: "classes",
           localField: "class_id",
           foreignField: "_id",
           as: "classes"
        }
      },
      {
        "$unwind": "$classes"
      },
      {
        $lookup:
        {
           from: "users",
           localField: "created_by",
           foreignField: "_id",
           as: "users"
        }
      },
      {
        "$unwind": "$users"
      },
      {$match:search},
      { $project : {
        'users.first_name':1,
        'users.first_last':1,
        'users.profile_image':1,
        'users._id':1,
        'classes._id':1,
        'classes.class_title':1,
        'classes.price':1,
        'class_session_date':1,
        'start_time_of_class':1,
        'end_time_of_class':1,
        'session_progress_status':1,
        'payout_status':1,
        'payout_amount':1
      } }
   ]);
    // var transactionsData = await classDetailsSchema.find(search)
    //   .populate("user_id", { first_name: 1, last_name: 1, profile_image: 1 })
    //   .skip(removeData)
    //   .limit(showData);

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: payoutsData,
      // totalTransactions:
      //   allTransactions.length != 0
      //     ? Math.ceil(allTransactions.length / showData)
      //     : 0,
      // allData: allTransactions,
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

//invoice by id

router.get("/invoice/:id", auth, async (req, res) => {
  var newArr = [];
  try {
    var transactionsData = await Transaction.findOne({
      _id: req.params.id,
      // deleted: 0,
    });
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
    // newArr.push({
    //   billing_date: transactionsData.billing_date,
    //   card_method: transactionsData.card_method,
    //   deleted: transactionsData.deleted,
    //   invoice_id: transactionsData.invoice_id,
    //   invoice_link: transactionsData.invoice_link,
    //   perValue: transactionsData.perValue,
    //   plan_end_date: transactionsData.plan_end_date,
    //   plan_start_date: transactionsData.plan_start_date,
    //   subscription_id: transactionsData.subscription_id,
    //   subscription_title: transactionsData.subscription_title,
    //   transaction_id: transactionsData.transaction_id,
    //   user_id: transactionsData.user_id,
    //   value: transactionsData.value,
    //   __v: transactionsData.__v,
    //   _id: transactionsData._id,
    //   email: user.email,
    //   phone: user.phone,
    //   name: user.firstname,
    // });
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

router.get("/search/:pageNo", auth, async (req, res) => {
  try {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var username = req.query.username;
    var transaction_id = req.query.transaction_id;
    var showPagination;
    var pageNo = req.params.pageNo;
    var showData = 10;
    var removeData = (pageNo - 1) * showData;
    var searchCondition = { deleted: 0 };
    if (startDate && endDate) {
      searchCondition["billing_date"] = { $gte: startDate, $lte: endDate };
    } else if (transaction_id) {
      searchCondition["transaction_id"] = transaction_id;
    }
    if (username) {
      var userData = await User.find(
        { firstname: { $regex: username, $options: "i" } },
        {
          _id: 1,
        }
      );
      var addThisUserInSearch = [];
      if (userData.length > 0) {
        searched_users = userData.length;
        for (var user_data = 0; user_data < searched_users; user_data++) {
          addThisUserInSearch.push(ObjectId(userData[user_data]._id));
        }
        searchCondition["user_id"] = { $in: addThisUserInSearch };
      }
      //console.log(userData);
    }
    console.log(searchCondition);

    var allTransactions = await Transaction.find(searchCondition);
    var transactionsData = await Transaction.find(searchCondition)
      .skip(removeData)
      .limit(showData);
    if (transactionsData.length == 0) {
      return res.json({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "transaction",
            location: "body",
          },
        ],
      });
    }
    const newUser = [];
    const newArr = [];
    var count = 0;
    count = Number(removeData) + Number(1);
    var totalPages = Math.ceil(allTransactions.length / 10);
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

    for (var i = 0; i < transactionsData.length; i++) {
      var isExists = await User.findOne({ _id: transactionsData[i].user_id });
      console.log(isExists);
      if (isExists) {
        //newUser.push(isExists);
        newArr.push({
          billing_date: transactionsData[i].billing_date,
          card_method: transactionsData[i].card_method,
          deleted: transactionsData[i].deleted,
          invoice_id: transactionsData[i].invoice_id,
          invoice_link: transactionsData[i].invoice_link,
          perValue: transactionsData[i].perValue,
          plan_end_date: transactionsData[i].plan_end_date,
          plan_start_date: transactionsData[i].plan_start_date,
          subscription_id: transactionsData[i].subscription_id,
          subscription_title: transactionsData[i].subscription_title,
          transaction_id: transactionsData[i].transaction_id,
          user_id: transactionsData[i].user_id,
          value: transactionsData[i].value,
          __v: transactionsData[i].__v,
          _id: transactionsData[i]._id,
          userDetails: {
            email: isExists ? isExists.email : "",
            phone: isExists ? isExists.phone : "",
            name: isExists ? isExists.firstname : "",
          },
          srNo: count++,
          showPagination: showPagination,
          totalPages: totalPages,
        });
      }
    }
    //console.log(newArr);

    return res.json({
      success: true,
      message: "Data fetch successfully",
      data: newArr,
      totalTransactions: allTransactions.length,
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
});

module.exports = router;
