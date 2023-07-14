const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const Subscription = require("../../models/Subscription");
const User = require("../../models/UserLogin");
const Transaction = require("../../models/Transaction");
var pdf = require("pdf-creator-node");
const fs = require("fs");
// var paypal = require('paypal-node-sdk');
const paypal = require("paypal-rest-sdk");
const paypal_secret_key = process.env.PAYPAL_SECRET_KEY;
const paypal_client_id = process.env.PAYPAL_CLIENT_ID;
const site_url = process.env.SITE_URL;
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: paypal_client_id,
  client_secret: paypal_secret_key,
});
router.get("/", async (req, res) => {
  res.render("index");
});
router.get("/paypal/:amount", (req, res) => {
  var amountValue = req.params.amount;
  let success_url =
    `${site_url}/v1/paypalPayment/success/${amountValue}`;
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: success_url,
      cancel_url: `${site_url}/v1/paypalPayment/failure`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: amountValue,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: amountValue,
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      res.redirect(payment.links[1].href);
    }
  });
});
router.get("/success/:amount", (req, res) => {
  var PayerID = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: req.params.amount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.render("success");
      }
    }
  );
});

router.get("cancel", (req, res) => {
  res.render("cancel");
});

router.post(
  "/transaction",
  auth,
  [
    check("amount", "Amount is required").matches(/^[0-9.]+$/),
    check("subscription_id", "Subscription ID is required").not().isEmpty(),
    check("transaction_id", "Transaction ID is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log("transaction API");
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, subscription_id, transaction_id } = req.body;
    const users = await User.findById(req.user.id);
    const subscription = await Subscription.findById(subscription_id);

    var theRandomNumber = Math.floor(Math.random() * 1000) + 1;
    var html = fs.readFileSync("invoice.html", "utf8");
    var invoice_link = users.firstname + Date.now() + ".pdf";
    const bitmap = fs.readFileSync("./uploads/group-6.png");
    const logo = bitmap.toString("base64");

    const transactions = await Transaction.find({ user_id: req.user.id });

    var date = new Date();
    var todayDate = new Date().toISOString().slice(0, 10);
    date.setDate(date.getDate() + subscription.expiration_days);
    var exp_date = date.toISOString().slice(0, 10);

    if (transactions.length == 0) {
      var plan_start = todayDate;
      var plan_expire = exp_date;
    } else {
      var last = await Transaction.findOne({ user_id: req.user.id })
        .sort({ _id: -1 })
        .limit(1);
      var todayDate2 = last.plan_end_date;
      var plan_start = new Date(todayDate2).toISOString().slice(0, 10);
      todayDate2.setDate(todayDate2.getDate() + subscription.expiration_days);
      var exp_date = todayDate2.toISOString().slice(0, 10);
      var plan_expire = exp_date;
    }

    var perValue =
      subscription.subscription_duration +
      (subscription.duration_type == 0
        ? "Life"
        : subscription.duration_type == 1
        ? " Years"
        : " Month");

    const newTransaction = new Transaction({
      user_id: req.user.id,
      subscription_id: subscription_id,
      transaction_id: transaction_id,
      value: amount,
      subscription_title: subscription.subscripton_title,
      billing_date: new Date().toISOString(),
      invoice_id: theRandomNumber,
      invoice_link: invoice_link,
      card_method: "Paypal",
      plan_start_date: plan_start,
      plan_end_date: plan_expire,
      perValue: perValue,
    });
    const transaction = await newTransaction.save();
    console.log(transaction);
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };
    var document = {
      html: html,
      data: {
        billing_date: todayDate,
        user_name: users.firstname,
        subscription_title: subscription.subscripton_title,
        invoice_id: theRandomNumber,
        user_address: users.basic_information,
        user_email: users.email,
        user_phone: users.phone,
        subscription_amt: subscription.original_price,
        discount: subscription.discount,
        discounted_price: subscription.discounted_price,
        logo: logo,
      },
      path: "./uploads/" + invoice_link,
      type: "",
    };

    pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

    res.send({
      success: true,
      message: "Transaction Successful",
      data: transaction,
    });
  }
);


module.exports = router;
