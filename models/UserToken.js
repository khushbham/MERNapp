const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserTokenSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    fcm_token:{
        type: String,
    },
    device_id:{
        type: String,
    },
    platform:{
        type: String,
        enum: ['web' , 'android' , 'ios']
    },
    ip_address:{
        type: String,
    },
    deleted: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default : Date.now()
    },
    updated_at: {
        type: Date,
    }
});

module.exports = UserToken = mongoose.model('user_token', UserTokenSchema);
