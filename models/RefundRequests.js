const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RefundRequestsSchema = new mongoose.Schema({
    transaction_id:{
        type: Schema.Types.ObjectId,
        ref: 'transactions'
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    session_ids: {
        type: [Schema.Types.ObjectId],
        ref: "class_details",
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
    class_created_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    class_booked_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    refund_status: {
        type: Number,
        default: 0, // 0 => pending , 1 => processed, 2 => cancelled
    },
    refund_amount: {
        type: Number,
        default: 0, 
    },
    reason_to_apply_refund:{
        type:String,
        default:""
    },
    refund_feedback_by_admin:{
        type:String,
        default:""
    },
    deleted: {
        type: Number,
        default: 0,
    },
    refund_action_taken_date: {
        type: Date
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
    },
});

module.exports = Payouts = mongoose.model('refund_requests', RefundRequestsSchema);
