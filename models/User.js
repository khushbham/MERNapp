const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
  phone: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  deleted: {
    type:Number,
    default: 0
  },
  account_verified: {
    type:Number,
    default: 0
  },
  otp: {
    type:Number
  },
  otp_expired:{
    type:Date,
  },
  account_status: {
    type:Number,
    default: 1 // 0 => Need verification, status is 1 => Active, 2 => Suspended , 3 => Deleted
  },
  email:{
    type: String
  },
  first_name:{
    type: String,
    default : ""
  },
  last_name:{
    type: String,
    default : ""
  },
  gender:{
    type: Number
  },
  dob: {
    type: String,
  },
  user_role:{
    type: Number,
    default:1
  },
  age:{
    type: Number,
    default:0
  },
  street_address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip_code: {
    type: String,
  },
  accept_terms_and_conditions:{
    type:Number,
    default:0
  },
  user_created_by_admin:{
    type:Number,
    default:0
  },
  topics: {
    type: [Number], //for student profile
  },
  expertise:{
    type: String, //for teacher profile
    default:""
  },
  about_expertise:{
    type: String, //for teacher profile
    default:""
  },
  language:{
    type: String, //for teacher profile
    default:""
  },
  intro_video:{
    type: String, //for teacher profile
    default:""
  },
  profile_image:{
    type: String, //for teacher profile
    default:""
  },
  planned_topics:{
    type: [String], //for teacher profile
  },
  profile_created:{
    type:Boolean,
    default:false
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
  card_details:{
    account_holder_name:{
      type: String
    },
    routing_number:{
      type: String
    },
    account_number:{
      type: String
    },
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

});

module.exports = User = mongoose.model('users', UserScheme);
