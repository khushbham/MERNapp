const mongoose = require('mongoose');
const CategoriesList = new mongoose.Schema({
    category_name: {
        type: String
    },
    category_status:{
        type:Boolean,
        default:false
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
    });

module.exports = SettingsData = mongoose.model('categories', CategoriesList);
