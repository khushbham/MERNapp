const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSettings = new mongoose.Schema({
    notification_id: {
        type: Schema.Types.ObjectId,
        ref: 'notification_settings'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    deleted: {
        type: Number,
        default: 0,
    },
    activation_status: {
        type: Boolean
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
    });

module.exports = NotificationSettingsData = mongoose.model('notification_setting_records', NotificationSettings);
