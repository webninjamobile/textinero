'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Callback Schema
 */
var CallbackSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Callback name',
		trim: true
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

mongoose.model('Callback', CallbackSchema);