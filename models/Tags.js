const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TagsList = new mongoose.Schema({
    tag_name: {
        type: String,
        unique:true
    },
    category_id: {
        type: Number
    },
    tag_status:{
        type:Boolean,
        default:false
    },
    tag_type: {
        type: Number
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
    });

module.exports = SettingsData = mongoose.model('tags', TagsList);
