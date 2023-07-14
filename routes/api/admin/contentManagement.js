const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../../middleware/auth");
const Settings = require("../../../models/Settings");
const Tags = require('../../../models/Tags');

router.get("/", auth, async (req, res) => {
  try {
    var UpdateSettingsData = await Settings.find();
    //await user.save();
    if (UpdateSettingsData.length == 0) {
      res.json({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "agreement",
            location: "body",
          },
        ],
      });
    }

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: UpdateSettingsData,
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
router.get("/getSinglePageDetail/:id", auth, async (req, res) => {
  try {
    var UpdateSettingsData = await Settings.findOne({_id:req.params.id});
    //await user.save();
    if (!UpdateSettingsData) {
      res.json({
        success: false,
        errors: [
          {
            msg: "No Record Found",
            param: "static-page",
            location: "body",
          },
        ],
      });
    }

    res.json({
      success: true,
      message: "Data fetch successfully",
      data: UpdateSettingsData,
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
  "/",
  auth,
  [
    check("setting_name", "Please enter valid setting name").not().isEmpty(),
    check("setting_title", "Please enter valid setting title").not().isEmpty(),

    check("setting_description", "Please enter valid setting description")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { setting_name, setting_title, setting_description } = req.body;

    try {
      var settingsObject = {};
      settingsObject.setting_name = setting_name;
      settingsObject.setting_title = setting_title;
      settingsObject.setting_description = setting_description;

      await Settings.findOneAndUpdate(
        { setting_name: setting_name },
        { $set: settingsObject },
        { new: true, upsert: true }
      );
      //await user.save();

      res.json({
        success: true,
        message: "Page updated successfully",
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

// @route    POST api/contentManagement/getTags
// @desc     view tags list
// @access   Public
router.post(
  '/getTags',
  async (req, res) => {

    try {
      const { tag_name, tag_type, tag_status, page } = req.body;
      var search = {};
      if(tag_name){
        search['tag_name'] = { $regex:  tag_name, $options: 'i' };
      }
      if(tag_type && tag_type > 0){
        search['tag_type'] = tag_type;
      }
      // if(tag_status && tag_status >= 0){
      //   search['tag_status'] = tag_status;
      // }
      console.log(tag_status)
      if(tag_status == 0){
        search['tag_status'] = false
      }
      if(tag_status && tag_status == 1){
        search['tag_status'] = true
      }
      var pageNumber = 1;
      if(page){
        pageNumber = page;
      }
      var limit = 10;
      var skip = (pageNumber - 1) * limit;
       var tagsData = await Tags.find(search).limit(limit).skip(skip).sort({created_at:-1});
       var totalTagsData = await Tags.find(search,{_id:1});
      //await user.save();
      // if(tagsData.length == 0){
      //   return res.status(400).send({
      //     success:false,
      //     "errors": [
      //       {
      //           "msg": "No Record Found",
      //           "param": "tags data",
      //           "location": "body"
      //       }
      //   ]
      //   });
      // }

      return res.json({
        success:true,
        message:'Data fetch successfully',
        data:tagsData,
        totalPages : Math.ceil(totalTagsData.length/limit)
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

// @route    put api/contentManagement/mergeTags
// @desc     view tags list
// @access   Public
router.put(
  "/mergeTags",
  [
    check("ids", "Please enter valid ids").not().isEmpty(),
    check("tag_name", "Please enter valid tag name").not().isEmpty(),
    check("tag_type", "Please enter valid tag type").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { ids, tag_name, tag_type } = req.body;

      var update = await Tags.deleteMany({ _id: { $in: ids } });

      //create new object
      const saveData = new Tags({
        tag_name: tag_name,
        tag_status: true,
        tag_type:tag_type,
        created_at: new Date()
      });
      //save the data
      try {
        await saveData.save({ ordered: false });
      } catch (e) {
        console.log('Duplicate entry')
      }
      return res.json({
        success: true,
        message: "Tag merged successfully",
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
