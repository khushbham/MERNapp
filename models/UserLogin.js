const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserScheme = new mongoose.Schema({
  
  profile_image:{
    type: [String]
  },
  google_ios_id:{
    type: String,
    default:"" 
  },
  via:{
    type: String,
    required: true,
    default:'phone'
  },
  profile_image_gallery: [
    {
      gallery_name: {
        type: String,
        required: true
      },
      image_name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  dummy:{
    type: Number,
    default:0
  },
  identity:{
    type: String,
    default:0
  },
  interest_in:{
    type: Number,
    default:0
  },
  age:{
    type: Number,
    default:0
  },
  firstname: {
    type: String
  },
  phone: {
    type:Number
  },
  otp: {
    type:Number
  },
  otp_expired:{
    type:Date,
  },
  email: {
    type: String,
  },
  dob: {
    type: String,
  },
  step:{
    type:Number,
    default: 0
  },
  password: {
    type: String
  },
  deleted:{
    type: Number,
    default: 0,
    required:true
  },
  suspended:{
    type: Number,
    default: 0
  },
  account_status:{
    type: Number,
    default: 0
  },
  flag_raised:{
    type: Number,
    default: 0
  },
  user_active:{
    type: Boolean,
    default: true,
  },
  i_agree:{
    type: Number,
    default: 0,
    required:true
  },
  basic_preference:{
    interest_in:{
      type: Number
    },
    min_age_range:{
      type: Number,
      default: 16
    },
    max_age_range:{
      type: Number,
      default: 85
    },
    distance:{
      type: Number,
      default: 0
    },
    neighbourhood:{
      type: String,
    },
    ethnicity:{
      type: Number,
      default: 0
    },
    religion:{
      type: Number,
      default: 0
    },
  },
  premium_preference:{
    min_height_range:{
      type: Number,
      default: 0
    },
    max_height_range:{
      type: Number,
      default: 0
    },
    have_children:{
      type: Number,
      default: 0
    },
    family_plans:{
      type: Number,
      default: 0
    },
    education_level:{
      type: Number,
      default: 0
    },
    drinking:{
      type: Number,
      default: 0
    },
    smoking:{
      type: Number,
      default: 0
    },
    marijuana:{
      type: Number,
      default: 0
    },
    drugs:{
      type: Number,
      default: 0
    },
  },

//  edit profile

detailed_profile: {
  about_me: {
    type: String,
    default:""
  },
  date_question: {
    type: [String]
  },
  work_and_education: {
    occupation: {
      type: String,
      default:""
    },
    education: {
      type:  String,
      default:""
    }
  },
  basic_information: {
    identity: {
      type: Number
    },
    live_where: {
      type: String,
      default:""
    },
    from_where: {
      type: String,
      default:""
    }
  },
  my_values : {
    type: [Number],
    default:[1,2,3,4,5]
  },
  religion: {
    type: Number,
    default:0
  },
  political_views: {
    type: Number,
    default:0
  },
  looking_for: {
    type: Number,
    default:0
  },
  family_plans: {
    type:Number,
    default:0
  },
  pets: {
    type: Number,
    default:0
  },
  diet_preferences: {
    type: Number,
    default:0
  },
  fitness: {
    type: Number,
    default:0
  },
  drinking: {
    type: Number,
    default:0
  },
  smoking: {
    type: Number,
    default:0
  },
  marijuana: {
    type: Number,
    default:0
  },
  drugs: {
    type: Number,
    default:0
  },
  latitude: {
    type: Number,
    default:0
  },
  longitude: {
    type: Number,
    default:0
  },
  height: {
    type: Number,
    default:0
  },
  ethnicity: {
    type: Number,
    default:0
  },
  education_level: {
    type: Number,
    default:0
  },
}, 
location: {
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  }
},
account_settings:{
  
  pause: {
    type: Number,
    default:0
  },
  email_notification: {
    type: Number,
    default:0
  },
  push_notification: {
    type: Number,
    default:0
  },
  facebook_account_status: {
    type: Number,
    default:0
  },
  facebook_account_link: {
    type: String,
    default:""
  },
  instagram_account_status: {
    type: Number,
    default:0
  },
  instagram_account_link: {
    type: String,
    default:""
  },
  linkedIn_account_status: {
    type: Number,
    default:0
  },
  linkedIn_account_link: {
    type: String,
    default:""
  },
  spotify_account_status: {
    type: Number,
    default:0
  },
  spotify_account_link: {
    type: String,
    default:""
  }
},
is_first: { // 1 means first time , 0 means not first time login
    type:Number,
    default:1
},
//end of edit detailed profile
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = User = mongoose.model('users_record', UserScheme);
