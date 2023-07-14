const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportClassSchema = new Schema ({

    class_id:{
        type: Schema.Types.ObjectId,
        ref: 'classes'
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

module.exports = ReportClass = mongoose.model('report_class', ReportClassSchema);