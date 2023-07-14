const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactsSchema = new mongoose.Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    deleted: {
        type: Number,
        default: 0
    },
    frozen_channel: {
        type: Boolean,
        default: false
    },
    blocked_by_student: {
        type: Boolean,
        default: false
    },
    blocked_by_teacher: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }

});

module.exports = Contacts = mongoose.model('contacts', ContactsSchema);
