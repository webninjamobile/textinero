'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Chat Schema
 */
var ChatSchema = new Schema({
	message: {
		type: String,
		default: '',
		required: 'Please fill Chat message',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	friend: {
		type: Schema.ObjectId,
		ref: 'Friend'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Chat', ChatSchema);
