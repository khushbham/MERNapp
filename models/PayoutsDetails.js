const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PayoutsSchema = new mongoose.Schema({
    payout_id:{
        type: Schema.Types.ObjectId,
        ref: 'payouts'
    },
    admin_type:{
        type: Number,
        default: 1, // 1 => super admin , 2 => subadmin
    },
    admin_id: {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    },
    subadmin_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    paid_amount:{
        type: Number,
        default: 0,
    },
    payout_status:{
        type: Number,
        default: 0, // 0 => pending , 1 => processed , 2 => cancelled
    },
    payout_feedback:{
        type:String,
        default:""
    },
    deleted: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
    },
});

module.exports = PayoutsDetail = mongoose.model('payout_details', PayoutsSchema);
