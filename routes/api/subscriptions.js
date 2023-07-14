const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Subscription = require('../../models/Subscription');

// @route    POST v1/subscriptions
// @desc     Create a subscription
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('subscripton_title', 'Subscription Title is required')
        .not()
        .isEmpty(),
        check('original_price', 'Subscription Price is required')
        .not()
        .isEmpty(),
        check('discount', 'Discount must be between 0 and 100')
        .isFloat({ min: 0, max: 100 }),
        check('image_link', 'Image Link is required')
        .not()
        .isEmpty(),
        check('duration_type', 'Duration type is required 0-lifetime, 1-years, 2 Months')
        .not()
        .isEmpty(),
        // check('subscription_offer', 'Subscription Offer is required')
        // .not()
        // .isEmpty(),
    ]
],
 
  async (req, res) => {
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false, errors: errors.array() });
    }
    try {
      const { 
        subscripton_title,
        subscription_duration,
        duration_type,
        original_price,
        discount,
        subscription_offer,
        image_link,
        expiration_days
      } = req.body;
    const subscriptionData = await Subscription.findOne({ subscripton_title: subscripton_title,deleted:0 });

    var subscriptionDetails = {};
    subscriptionDetails.subscripton_title = subscripton_title;
    subscriptionDetails.subscription_duration = subscription_duration;
    subscriptionDetails.duration_type = duration_type;
    subscriptionDetails.original_price = original_price;
    subscriptionDetails.discount = discount;
    if(duration_type == 0){
      subscriptionDetails.expiration_days = 0;

    }else if(duration_type == 2){
      subscriptionDetails.expiration_days = 30*Number(subscription_duration);
    }
    else if(duration_type == 1){
      subscriptionDetails.expiration_days = 30*Number(subscription_duration)*12;
    }
    subscriptionDetails.deleted = 0;
    subscriptionDetails.updated_at = new Date();
    if(!subscriptionData){
      subscriptionDetails.created_at = new Date();

    }
    if(subscription_offer == ""){
      subscriptionDetails.subscription_offer = "";

    }
    if(subscription_offer){
      subscriptionDetails.subscription_offer = subscription_offer;
    }
    subscriptionDetails.image_link = image_link;
    if (discount == 0) {
        subscriptionDetails.discounted_price = original_price;
    } else {
        var dec = (discount / 100).toFixed(2); 
            var mult = original_price * dec; // gives the value for subtract from main value
            var discounts = original_price - mult;
            console.log(discounts);
            subscriptionDetails.discounted_price = discounts;
        }

    const subscription = await Subscription.findOneAndUpdate(
            { subscripton_title: subscripton_title },
            { $set: subscriptionDetails },
            {new:true,upsert:true}
          );
      res.json({
        success:true,
        message:'Subscription added successfully',
        data:subscription
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

// @route    GET /subscriptions
// @desc     Get all subscriptions
// @access   Public
router.get('/',[ auth ], async (req, res) => {
    try {
      const subscriptions = await Subscription.find().populate('subscription', ['subscripton_title', 'subscription_duration','subscription_offer','original_price','image_link','discount']);
      var updatedArray = [];
      for(var i=0;i<subscriptions.length;i++){
        var _id = subscriptions[i]._id;
        var icon = subscriptions[i].image_link;
        var title = subscriptions[i].subscripton_title;
        var price = subscriptions[i].original_price;
        var perValue = subscriptions[i].subscription_duration + 
        (subscriptions[i].duration_type == 0 ? 'Life' : (subscriptions[i].duration_type == 1 ? " Years" : " Month"));
         
        var saveValue = subscriptions[i].discount != 0 ? subscriptions[i].discount : "";
        var bestValueImage = subscriptions[i].subscription_offer;
        updatedArray.push({
          _id:_id,
          icon:icon,
          title:title,
          price:price,
          perValue:perValue,
          saveValue:saveValue,
          bestValueImage:bestValueImage
        })
      }
      res.json({
        "success" : true,
        "message":"Record fetch successfully",
        data:updatedArray
      });
      //res.json(subscriptions);
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


// @route    GET /subscriptions
// @desc     Get one subscriptions by ID
// @access   Public
router.get('/:id',[ auth ], async (req, res) => {
  try {
    console.log('API hit');
    const subscriptions = await Subscription.findOne({_id:req.params.id,deleted:0});
    if(!subscriptions){
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
      data:subscriptions
    });
    //res.json(subscriptions);
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


module.exports = router;
