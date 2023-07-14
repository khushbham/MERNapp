const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountDetailSchema = new mongoose.Schema({
  teacher_id:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  card_name :{
    type: String,
  },
  account_number:{
    type:Number,
  },
  routing_number:{
    type:Number,
  },
  deleted: {
    type:Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }

});

module.exports = AccountDetail = mongoose.model('account_details', AccountDetailSchema);
