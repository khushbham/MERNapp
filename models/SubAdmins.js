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
  role:{
    type: Number,
    required: true,
    default:2
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  deleted:{
      type: Number,
      required: true,
      default:0
  },
  address: {
    type: String
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

});

module.exports = User = mongoose.model('sub_admin_records', AdminScheme);
