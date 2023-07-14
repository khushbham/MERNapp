const mongoose = require('mongoose');

const AdminScheme = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  otp: {
    type:Number
  },
  otp_expired:{
    type:Date,
  },
  otp_verified_once:{
    type: Boolean,
    default:false
  },
  address: {
    type: String
  },
  updated_at: {
    type: Date
  }

});

module.exports = User = mongoose.model('admin', AdminScheme);
