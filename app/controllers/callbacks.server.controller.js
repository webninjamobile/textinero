'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	//Inbound = mongoose.model('Inbound'),
	//Feedback = mongoose.model('Feedback'),
	//Member = mongoose.model('Member'),
	User = mongoose.model('User'),
	transport = require('../../local_modules/transport.js'),
	_this = this,
	_ = require('lodash');

/* save stats */
var saveInbound = function (status, req, data) {
	//save stats
	var inbound = new Inbound();
	inbound.type = 'chikka';
	inbound.status = status;
	inbound.response = data;
	inbound.data = req.body;
	inbound.save(function (err, data) {
	});
}



/**
 * Receives an SMS via post -- chikka
 * @params message_type,mobile_number,shortcode,request_id,message,timestamp
 */
exports.inbound = function (req, res) {
	var message = req.body.message.split(" ");
	var keyword = message[0].toLowerCase();
	var errMessage = 'Mobile number will be blocked from sending messages for 24hrs after 3 invalid tries.';
	User.findOne({shortCode: req.body.shortcode}).exec(function (err, userData) {
		if (!err && userData) {
			if (_this.hasOwnProperty(keyword)) {
				message.splice(0, 1);//remove keyword
				//  logger.info("got keyword -->" + keyword);
				_this[keyword](message, userData, res, req);
			} else {
				transport.chikkaSend(req.body, 'Keyword is invalid. ' + errMessage, function (data, response) {
					saveInbound('invalidKeyword', req, data);

				})
				res.send('Accepted');

			}


		} else {
			saveInbound('shortCodeNotFound', req);
			res.send('Accepted');
		}
	});


}


/**
 * Receives feedback
 * requires userdata checking
 */
exports.feedback = function (message, userData, res, req) {
	var mobile = req.body.mobile_number.substring(2, 12);
	//must create a member data where user can only accept a valid number based on the database
	Member.findOne({mobile: '0' + mobile, user: userData._id}, function (err, memberData) {
		//only registered members
		logger.info("got memberData -->" + memberData);
		if (memberData) {
			var feedback = new Feedback();
			feedback.feedback = message.join(" ");
			feedback.data = req.body;
			feedback.member = memberData;
			feedback.user = userData._id;
			feedback.save(function (err, data) {
				if (!err) {
					transport.chikkaReply(req.body, 'Thank you.', function (data, response) {
						saveInbound('success', req, data);
					});
				} else {
					saveInbound('systemError', req);
				}
				res.send('Accepted');
			});
		} else {
			var errMessage = 'Mobile number will be blocked from sending messages for 24hrs after 3 invalid tries.';
			transport.chikkaSend(req.body, 'Number is not registered. ' + errMessage, function (data, response) {
				saveInbound('unregisteredNumber', req, data);

			})
			res.send('Accepted');
		}
	});


};

/**
 * Check enrollment
 */
exports.chat = function (message, userData, res, req) {
	var idGiven = message[0];
	var email = message[1];
	var mobile = req.body.mobile_number.substring(2, 12);

	res.send('Accepted');
}
;

