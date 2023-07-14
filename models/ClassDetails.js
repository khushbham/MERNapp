const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classDetailsSchema = new mongoose.Schema({
  class_title: {
    type: String
  },
  day_of_class: {
    type: Number
  },
  month_of_class: {
    type: Number
  },
  year_of_class: {
    type:Number
  },
  class_date:{
    type: String
  },
  class_session_date:{
    type:Date
  },
  start_time_of_class:{
    type: String
  },
  transaction_id:{
    type: Schema.Types.ObjectId,
    ref: 'transactions'
  },
  end_time_of_class:{
    type: String 
  },
  class_id:{
    type: Schema.Types.ObjectId,
    ref: 'classes'
  },
  session_progress_status:{
    type:Number,
    default:0
  },
  created_by:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  payout_status:{
    type:Number,
    default:0
  },
  payout_amount:{
    type:Number,
    default:0
  },
  deleted:{
    type:Number,
    default:0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

});

module.exports = Class = mongoose.model('class_details', classDetailsSchema);
