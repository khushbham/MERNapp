const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportUserSchema = new Schema ({

    reported_to:{
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    reported_by:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    report_title:{
        type:String,
    },
    report_description:{
        type:String,
    }
},{timestamps: true});

module.exports = ReportClass = mongoose.model('report_user', ReportUserSchema);