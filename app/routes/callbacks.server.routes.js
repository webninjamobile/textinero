'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var callbacks = require('../../app/controllers/callbacks.server.controller');

	app.route('/callback/inbound')
		.post(callbacks.inbound);

};
