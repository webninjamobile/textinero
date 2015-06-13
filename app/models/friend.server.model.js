'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validateMobileNumber = function(value) {
	return (value.length == 11 && value.substring(0,2) == '09');
};


/**
 * Friend Schema
 */
var FriendSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Friend name',
		trim: true
	},mobile: {
		type: String,
		default: '',
		required: 'Please fill Mobile Number',
		trim: true,
		validate: [validateMobileNumber, 'Mobile number format is invalid - eg: 09221234567']
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Friend', FriendSchema);
