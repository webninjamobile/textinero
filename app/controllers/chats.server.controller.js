'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chat = mongoose.model('Chat'),
	Friend = mongoose.model('Friend'),
    transport = require('../../local_modules/transport.js'),
	_ = require('lodash');

exports.friend = function(req,res){

    Chat.find({friend:req.params.friend}).populate('friend', 'name').exec(function(err,data){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(data);
        }
    });
}

/**
 * Create a Chat
 */
exports.create = function(req, res) {
	var chat = new Chat(req.body);
	chat.user = req.user;

	chat.save(function(err,chatData) {

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            Friend.findById(chatData.friend).exec(function(err,data){
                //console.log(data);
                transport.chikkaSend(data.mobile, req.body.message, function (data, response) {
                    console.log(data);
                    console.log(response);

                })
            });

			res.jsonp(chat);
		}
	});
};

/**
 * Show the current Chat
 */
exports.read = function(req, res) {
	res.jsonp(req.chat);
};

/**
 * Update a Chat
 */
exports.update = function(req, res) {
	var chat = req.chat ;

	chat = _.extend(chat , req.body);

	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chat);
		}
	});
};

/**
 * Delete an Chat
 */
exports.delete = function(req, res) {
	var chat = req.chat ;

	chat.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chat);
		}
	});
};

/**
 * List of Chats
 */
exports.list = function(req, res) { 
	Chat.find().sort('-created').populate('user', 'displayName').exec(function(err, chats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chats);
		}
	});
};

/**
 * Chat middleware
 */
exports.chatByID = function(req, res, next, id) { 
	Chat.findById(id).populate('user', 'displayName').exec(function(err, chat) {
		if (err) return next(err);
		if (! chat) return next(new Error('Failed to load Chat ' + id));
		req.chat = chat ;
		next();
	});
};

/**
 * Chat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chat.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
