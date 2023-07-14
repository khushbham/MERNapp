const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classesSchema = new mongoose.Schema({
    booked_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    class_id:{
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    transaction_id:{
        type: Schema.Types.ObjectId,
        ref: 'transactions'
    },
    created_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    booking_slot:{
        type: String
    },
    booking_status:{
        type: Number,
        default: 0, //0 => booked, 1 => cancelled
    },
    day_of_class: {
        type: Number
    },
    month_of_class: {
        type: Number
    },
    year_of_class: {
        type:Number
    },
    class_date:{
        type: String
    },
    class_session_date:{
        type:Date
    },
    start_time_of_class:{
        type: String
    },
    end_time_of_class:{
        type: String 
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }

});

module.exports = BookedClass = mongoose.model('scheduled_availabilities', classesSchema);
