'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Friend = mongoose.model('Friend'),
	_ = require('lodash');

/**
 * Create a Friend
 */
exports.create = function(req, res) {
	var friend = new Friend(req.body);
	friend.user = req.user;
	friend.isConfirmed = true;

	friend.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * Show the current Friend
 */
exports.read = function(req, res) {
	res.jsonp(req.friend);
};

/**
 * Update a Friend
 */
exports.update = function(req, res) {
	var friend = req.friend ;

	friend = _.extend(friend , req.body);

	friend.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * Delete an Friend
 */
exports.delete = function(req, res) {
	var friend = req.friend ;

	friend.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * List of Friends
 */
exports.list = function(req, res) { 
	Friend.find().sort('-created').populate('user', 'displayName').exec(function(err, friends) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friends);
		}
	});
};

/**
 * Friend middleware
 */
exports.friendByID = function(req, res, next, id) { 
	Friend.findById(id).populate('user', 'displayName').exec(function(err, friend) {
		if (err) return next(err);
		if (! friend) return next(new Error('Failed to load Friend ' + id));
		req.friend = friend ;
		next();
	});
};

/**
 * Friend authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.friend.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
