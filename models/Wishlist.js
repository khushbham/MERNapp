const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Wishlist = new mongoose.Schema({
    teacher_id:{
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    student_id:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
    });

module.exports = SettingsData = mongoose.model('wishlist', Wishlist);
