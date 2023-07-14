const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classesSchema = new mongoose.Schema({
  class_created_from: {
    type: String // from web-app or app
  },
  discipline: {
    type: String
  },
  class_status: {
    type:Number,
    default: 1 // 0 => Draft, 1 => Published , 2 => Archived
  },
  topics: {
    type:[String]
  },
  topics_text: {
    type:[String]
  },
  class_title: {
    type: String
  },
  class_subtitle: {
    type: String
  },
  class_description: {
    type: String
  },
  class_level: {
    type:Number
  },
  language_of_class:{
    type: String
  },
  cover_image:{
    type: String
  },
  type_of_class:{
    type: Number // 1 => on demand, 2 => single class , 3 => course
  },
  session_type: {
    type:Number
  },
  session_duration: {
    type:Number
  },
  price: {
    type:Number
  },
  max_students_allowed: {
    type:Number
  },
  enrolled_students: {
    type:Number
  },
  address_or_class_link:{
    type: String
  },
  class_detail:[
    {
      class_date: {
        type: Date,
      },
      class_start_time: {
        type: String,
      },
      class_end_time: {
        type: String,
      }
    }
  ],
  created_by:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  platform_fee_percentage:{
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

});

module.exports = Class = mongoose.model('classes', classesSchema);
