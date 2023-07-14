//const Stripe = require('stripe');

const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
//const Subscription = require('../../models/Subscription');
const stripeKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeKey);
const User = require('../../models/UserLogin');
const Transaction = require('../../models/Transaction');
const app = express();
//var pdf = require("pdf-creator-node");
const fs = require('fs');
const { Console } = require('console');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const AWS = require('aws-sdk');

const region = "us-east-2"
const bucketName = "mymentorbucket"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})
// var html = fs.readFileSync("invoice.html", "utf8");
// console.log(html);
// var options = {
//   format: "A3",
//   orientation: "portrait",
//   border: "10mm",
//   header: {
//       height: "45mm",
//       contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
//   },
//   footer: {
//       height: "28mm",
//       contents: {
//           first: 'Cover page',
//           2: 'Second page', // Any page number is working. 1-based index
//           default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
//           last: 'Last Page'
//       }
//   }
// };
// var users = 
//   {
//     name: "Shyam",
//     age: "26",
//   };
// var document = {
//   html: html,
//   data: {
//     users: users,
//   },
//   path: "./output.pdf",
//   type: "",
// };
// pdf
//   .create(document, options)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
// const stripeNew = new Stripe('sk_test_sP0QdhRLHJtASfQSsUDrXiPp00IPjhzPOr',{
//     apiVersion: '2020-08-27',
// })

// @route    POST v1/subscriptions
// @desc     Create a subscription
// @access   Private

router.post('/',
auth, 
[
  check(
    'amount',
    'Amount is required'
  ).matches(/^[0-9.]+$/),
  check('class_id', 'Class ID is required')
        .not()
        .isEmpty(),
], 
async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, errors: errors.array() });
    }



    const { amount,class_id } = req.body;
    
   var theRandomNumber = Math.floor(Math.random() * 1000) + 1;
   var html = fs.readFileSync("invoice.html", "utf8");
   var invoice_link = Date.now()+".pdf";
   const bitmap = fs.readFileSync( "./uploads/client-logo.png");
    const logo = bitmap.toString('base64');
    var todayDate = new Date().toISOString().slice(0, 10);
    const data = {
      font: {
          "color" : "green",
          "include": "https://api.***.com/parser/v3/css/combined?face=Kruti%20Dev%20010,Calibri,DevLys%20010,Arial,Times%20New%20Roman"
      },
      testData: 
      {
        billing_date: todayDate,
        user_name: 'Rekha Kaler',
        street_address:'1234 Main',
        city:'Apt. 48',
        state:'Springfield',
        zip_code:'ST 54321',
        invoice_id: theRandomNumber,
        email_entered_in_payment_gateway: 'rekha.fresco@gmail.com',
        class_price: 100,
        logo: logo,
        card_type:'Visa',
        card_last_digits:2456,
        class_title:'Class Name or Payment Description Will Be Here and can be multiline if need be',
        date_of_class:'01-23-2022',
        time_of_class: '10:00 AM'
      } 
  };  
        const filePathName = path.resolve(__dirname, 'htmltopdf.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();
        let  options = { format: 'Letter' };
        const ejsData = ejs.render(htmlString, data);


        return await pdf.create(ejsData, options).toStream((err, response) => {
            if (err) return console.log(err);
            return new Promise((ress, rej) => {
                const uploadParams = {
                  Bucket: bucketName,
                  Key: invoice_link,
                  ACL: 'public-read-write',
                  Body: response,
                };
                s3.upload(uploadParams, (err, data) => {
                  if (err) {
                      console.log("error", err);
                    rej('');
                  }
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
    success:true,
    message:'Payment Successful',
    //data: paymentIntent,
  });
});


// @route    GET /subscriptions
// @desc     Get one subscriptions by ID
// @access   Public
router.get('/transaction_history',[ auth ], async (req, res) => {
  try {
    

    const transactions = await Transaction.find({user_id:req.user.id,deleted:0});
    if(transactions.length == 0){
      return res.status(404).send({
        success:false,
        "errors": [
          {
              "msg": "No record found",
              "param": "id",
              "location": "params"
          }
      ]
      });
    }
    res.json({
      "success" : true,
      "message":"Record fetch successfully",
      data:transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success:false,
      "errors": [
        {
            "msg": "Server error",
            "param": "server",
            "location": "body"
        }
    ]
    });
  }
});

router.get(
  '/user_subscription',[ auth ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false, errors: errors.array() });
    }
    try {
      // const transactions = await Transaction.find({user_id:req.user.id});
      const active_plan = await Transaction.findOne({ 
        user_id:req.user.id,
        plan_start_date : { $lte:new Date()},
        plan_end_date : { $gte:new Date()}}).sort({plan_start_date:1})
      if(!active_plan){
        return res.status(404).send({
          success:false,
          "errors": [
            {
                "msg": "No record found",
                "param": "id",
                "location": "params"
            }
        ]
        });
      }
      res.json({
        "success" : true,
        "message":"Record fetch successfully",
        data:active_plan
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        success:false,
        "errors": [
          {
              "msg": "Server error",
              "param": "server",
              "location": "body"
          }
      ]
      });
    }
  }
);





// router.post(
//   '/',
//   [ auth ],
 
//   async (req, res) => {
    
//     try {
//         const { product } = req.body;
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "inr",
//                         product_data: {
//                             name: product.name,
//                             images: [product.image],
//                         },
//                         unit_amount: product.amount * 100,
//                     },
//                     quantity: product.quantity,
//                 },
//             ],
//             mode: "payment",
//             // success_url: `${YOUR_DOMAIN}/success.html`,
//             // cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//         });
    
//         res.json({ id: session.id });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send({
//         success:false,
//         "errors": [
//           {
//               "msg": "Server error",
//               "param": "server",
//               "location": "body"
//           }
//       ]
//       });
//     }
//   }
// );

// @route    GET /subscriptions
// @desc     Get all subscriptions
// @access   Public
// router.get('/',[ auth ], async (req, res) => {
//     try {
//       const subscriptions = await Subscription.find().populate('subscription', ['subscripton_title', 'subscription_duration','subscription_offer','original_price','image_link','discount']);
//       res.json({
//         "success" : true,
//         "message":"Record fetch successfully",
//         data:subscriptions
//       });
//       //res.json(subscriptions);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send({
//         success:false,
//         "errors": [
//           {
//               "msg": "Server error",
//               "param": "server",
//               "location": "body"
//           }
//       ]
//       });
//     }
// });


// @route    GET /subscriptions
// @desc     Get one subscriptions by ID
// @access   Public
// router.get('/:id',[ auth ], async (req, res) => {
//   try {
//     const subscriptions = await Subscription.findOne({_id:req.params.id,deleted:0});
//     if(!subscriptions){
//       return res.status(404).send({
//         success:false,
//         "errors": [
//           {
//               "msg": "No record found",
//               "param": "id",
//               "location": "params"
//           }
//       ]
//       });
//     }
//     res.json({
//       "success" : true,
//       "message":"Record fetch successfully",
//       data:subscriptions
//     });
//     //res.json(subscriptions);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({
//       success:false,
//       "errors": [
//         {
//             "msg": "Server error",
//             "param": "server",
//             "location": "body"
//         }
//     ]
//     });
//   }
// });


module.exports = router;
