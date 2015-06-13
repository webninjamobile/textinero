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

	var mobile = req.body.mobile_number.substring(2, 12);
	Friend.findOne({mobile: '0'+mobile}).exec(function (err, userData) {
		if (!err && userData) {
			//comment upon push
			console.log("got it!");
            //hack for now

            var chat = new Chat();

            chat.friend = {name:userData,_id:userData._id};
            chat.message = req.body.message;
            chat.save(function(err,doc) {
                if (err) {

                } else {
                    var push = doc.toObject();
                    push.friend = userData;
                    console.log(push);
                    pusher(push);
                }
            });

			transport.chikkaReply(req.body, 'Message Accepted.', function (data, response) {
			});
            res.send('Accepted');
		} else {
			console.log("Friends not found");
            transport.chikkaReply(req.body, 'Message Not Accepted. You are not currently added as a friend.', function (data, response) {
            });
			res.send('Friends not found ,Accepted');
		}
	});


}

