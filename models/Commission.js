const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommissionSchema = new mongoose.Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    ref: 'admin'
  },
  refund_commission:{
    type: Number,
  },
  payout_commission:{
    type: Number,
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

module.exports = Commission = mongoose.model('commission_details', CommissionSchema);
