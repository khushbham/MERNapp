const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction_schema = new mongoose.Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    transaction_id: {
        type: String,
        required: true,
    },
    paymentmethod_id: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    invoice_id: {
        type: String,
        required: true,
    },
    invoice_link: {
        type: String,
        required: true,
    },
    invoice_data:{
        billing_date: {
            type: String
        },
        user_name: {
            type: String
        },
        street_address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip_code: {
            type: String
        },
        invoice_id: {
            type: String
        },
        class_price: {
            type: String
        },
        logo: {
            type: String
        },
        card_type: {
            type: String
        },
        card_last_digits: {
            type: String
        },
        class_title: {
            type: String
        },
        classDetailData: [
        {
            class_date: {
                type: String
            },
            start_time_of_class:{
                type: String
            }
        }
        ],
    },
    billing_date: {
        type: Date,
        required: true,
    },
    channel_id:{
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    payment_status:{
        type: Number,
        default: 0,
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

module.exports = Transaction = mongoose.model('transactions', Transaction_schema);
