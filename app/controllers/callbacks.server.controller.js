'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Chat = mongoose.model('Chat'),
    Friend = mongoose.model('Friend'),
    pusher = require('../../local_modules/pusher.js'),
    transport = require('../../local_modules/transport.js'),
    _this = this,
    _ = require('lodash');


/**
 * Receives an SMS via post -- chikka
 * @params message_type,mobile_number,shortcode,request_id,message,timestamp
 */
exports.inbound = function (req, res) {

    var mobile = '0' + req.body.mobile_number.substring(2, 12);

    Friend.findOne({mobile: mobile}).exec(function (err, friendData) {
        if (!err && friendData) {
            //comment upon push
            console.log("got it!");
            _this.saveChat(friendData,req.body.message);
            transport.chikkaReply(req.body, 'Message Accepted.', function (data, response) {
            });
            res.send('Accepted');
        } else {
            // TODO: add feature to add as friend via text
            User.findOne().exec(function (err, userData) {
                //add as an unconfirmed friend
                var friend = new Friend();
                friend.mobile = mobile;
                friend.name = mobile;
                friend.isConfirmed = false;
                friend.user = userData;
                friend.save(function(err,friendData){
                    _this.saveChat(friendData,req.body.message);
                });


            });


            console.log("Friends not found");
            transport.chikkaReply(req.body, 'You are not currently added as a friend.', function (data, response) {
            });
            res.send('Friends not found ,Accepted');
        }


    });


}

exports.saveChat = function(friendData,message){
    //save chat regardless if friend of not
    var chat = new Chat();
    chat.friend = {name: friendData, _id: friendData._id};
    chat.message = message;
    chat.save(function (err, doc) {
        if (err) {

        } else {
            var push = doc.toObject();
            push.friend = friendData;
            console.log(push);
            pusher(push,friendData._id);
        }
    });

}
