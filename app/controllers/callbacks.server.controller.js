'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Friend = mongoose.model('Friend'),
	transport = require('../../local_modules/transport.js'),
	_this = this,
	_ = require('lodash');



/**
 * Receives an SMS via post -- chikka
 * @params message_type,mobile_number,shortcode,request_id,message,timestamp
 */
exports.inbound = function (req, res) {
	console.log(req.body);
	var mobile = req.body.mobile_number.substring(2, 12);
	Friend.findOne({mobile: '0'+mobile}).exec(function (err, userData) {
		if (!err && userData) {
			//comment upon push
			console.log("got it!");
			transport.chikkaReply(req.body, 'Message Accepted', function (data, response) {
			});
		} else {
			console.log("Friends not found");
			res.send('Accepted');
		}
	});


}

