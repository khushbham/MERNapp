const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var admin = require("firebase-admin");
const serviceAccount = require("../../../firebase.json");
const UserToken = require("../../../models/UserToken");
const NotificationsSettings = require("../../../models/NotificationsSettings");

module.exports = {
    //manage send notification
    SendNotification: async(userIds , notificationObj , configId = null) => {
        //@ userIds of user to get the multiple token whom we want to notify (according to previous logic but this was changed in 26:09:2022)
           //Now the userIds always should be single id inside the array
        //@ notification object of notification  {title of notification , body of notification , imageUrl}
        const userId = userIds[0]
        var NotificationNotTobeSend  = ""
        if(configId !== null){
          // console.log("always be a single user id" ,userId , configId)
          //Check whom I'm not send notification
          NotificationNotTobeSend = await NotificationsSettings.aggregate([
              {
                $lookup: {
                  from: "notification_setting_records",
                  localField: "_id",
                  foreignField: "notification_id",
                  as: "notification_setting_records",
                },
              },
              {
                $match: {
                  "notification_setting_records.user_id" : ObjectId(userId),
                  notification_unique_id : configId,
                  "notification_setting_records.activation_status" : true
                },
              },
              {
                $project : {
                  _id : 1,
                  user_id : "$notification_setting_records.user_id"
                }
              },
              { $sort: { _id: -1 } },
          ]);
          //update (26:09:2022)  
          // console.log("Notification ss" ,NotificationNotTobeSend.length)
          if(NotificationNotTobeSend.length == 0){
              return false
          }
        }

        var getAllTokens = await UserToken.find({user_id : {$in : userIds}})
        var tokens = []
        getAllTokens.map(data => {
            tokens.push(data.fcm_token)
        })
        console.log(tokens)
        // var tokens = [
        //     "eAv0BDUrUkaZna0MvyEEAj:APA91bHt_tag0assvfp0B8ba80VNtF3OX_UW9gTFd8X8aUfiJfumxC2DFCq9D6VNIaYaykxQWmdj7Ew_L5q7i5wStwIaYAhmU9abyvjeSH73VcVRGOt7ZztKp6IYMlzEby7vXMn_olQf",
        //     "cw-p9ceLTVaTqI3QlQpjoi:APA91bEg9tfim8yN4CL068ZZstR2Fg2hLYT13vs07CdQiyIAa0y72D7ojnoddyuSfcIv_hO0-b0L6KdxLV4n95369nnxCtvI4FFVRjMaJzBXNRHotIjfOv3Tic7VbvRD0dIUpoe7ywtc"
        // ]
        try {
            const notify = await admin.messaging().sendMulticast({
                tokens,
                    // "topic":"IOS TESting kamalsubscriber-updates",
                    "notification":{
                    "body" : notificationObj.body,
                    "title" : notificationObj.title,
                    },
                    "data" : {
                    "volume" : "3.21.15",
                    "contents" : notificationObj.contents
                    },
                });
                var unrecognizedTokens = []
                for (let i = 0; i < tokens.length; i++) {
                    if(notify.responses[i].success == false){
                        unrecognizedTokens.push(tokens[i])
                    }
                }
                //Remove the unrecognized tokens
            await UserToken.deleteMany({fcm_token : {$in : unrecognizedTokens}})
            console.log("working" , notify)
            return({ 
                success: true,
                msg: "Notify succssfully.",
                data : notify
            });
            } catch (err) {
                return(
                { 
                    success: false,
                    msg: err.message || "Something went wrong!" 
                });
            }
    }
    //Manage the remove the notification
    
}