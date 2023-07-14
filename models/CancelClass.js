const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CancelClassSchema = new mongoose.Schema({
  cancelled_by:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  paid_to: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  session_id:{
    type: Schema.Types.ObjectId,
    ref: 'classes'
  },
  reason:{
    type: String
  },
  paid_status:{
    type:Number, // 1 for paid - done
    default: 0 
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

module.exports = CancelClass = mongoose.model('cancel_classes', CancelClassSchema);
