const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardDetailSchema = new mongoose.Schema({
  teacher_id:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  card_number:{
    type: String,
  },
  card_name :{
    type: String,
  },
  card_expiry_date:{
    type: String,
  },
  card_security_code:{
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

module.exports = CardDetail = mongoose.model('card_details', CardDetailSchema);
