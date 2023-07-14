const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new mongoose.Schema({
  notification_title: {
    type: String
  },
  notification_type:{
    type: Number,
    default: 0
  },
  notification_msg:{
    type: String 
  },
  action_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
  },
  notify_to:{
        type: Schema.Types.ObjectId,
        ref: 'users'
  },
  class_id:{
        type: Schema.Types.ObjectId,
        ref: 'classes'
  },
  read_status:{
    type: Number, // 0 => unread , 1 => read
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

module.exports = Notification = mongoose.model('notifications', NotificationSchema);
