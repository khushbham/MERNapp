const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PayoutsSchema = new mongoose.Schema({
    platform_fee:{
        type: Number,
    },
    platform_fee_percentage:{
        type: Number,
        required: true,
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    session_ids: {
        type: [Schema.Types.ObjectId],
        ref: "class_details",
      },
    class_created_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    class_booked_by:{
        type: [Schema.Types.ObjectId],
        ref: 'users'
    },
    total_amount: {
        type: Number,
        default: 0
    },
    earning: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Number,
        default: 0,
    },
    payout_start_date: {
        type: Date
    },
    is_payout_detail_exists: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
    },
});

module.exports = Payouts = mongoose.model('payouts', PayoutsSchema);
