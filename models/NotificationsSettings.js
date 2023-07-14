const mongoose = require("mongoose");

const NotificationSettings = new mongoose.Schema({
  notification_type: {
    type: Number, // 1 => Sessions, 2 => Financials
  },
  notification_unique_id: {
    type: Number, 
    // 1 => Session reminder for student , 
    // 2 => Session is canceled for student, 
    // 3 => A refund is issued for student,
    // 4 => Class is scheduled - Teacher,
    // 5 => Session reminder - Teacher,
    // 6 => Session is canceled - Teacher,
    // 7 => A payout is released,
  },
  setting_title: {
    type: String,
  },
  deleted: {
    type: Number,
    default: 0,
  },
  user_role: {
    type: Number, // 1 => Student, 2 => Teacher
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = NotificationSettingsData = mongoose.model(
  "notification_settings",
  NotificationSettings
);
