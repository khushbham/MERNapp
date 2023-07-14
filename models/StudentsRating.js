const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rating_schema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    rating_given_to: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    rating: {
        type: Number,
        default:0
    },
    feedback: { 
        type: String
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

module.exports = Rating = mongoose.model('students_ratings', rating_schema);
