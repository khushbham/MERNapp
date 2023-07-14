const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitiesSchema = new mongoose.Schema({
  start_date:{
    type: Date
  },
  end_date:{
    type: Date
  },
  start_time:{
    type: String
  },
  end_time:{
    type: String 
  }, 
  repeat_period: {
    type:Number
  },
  day: {
    type: Number
  },
  month: {
    type: Number
  },
  year: {
    type:Number
  },
  created_by:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

});

module.exports = Availabilities = mongoose.model('availabilities', AvailabilitiesSchema);
