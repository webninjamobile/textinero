'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var friends = require('../../app/controllers/friends.server.controller');

	// Friends Routes
	app.route('/friends')
		.get(friends.list)
		.post(users.requiresLogin, friends.create);

	app.route('/friends/:friendId')
		.get(friends.read)
		.put(users.requiresLogin, friends.hasAuthorization, friends.update)
		.delete(users.requiresLogin, friends.hasAuthorization, friends.delete);

	// Finish by binding the Friend middleware
	app.param('friendId', friends.friendByID);
};
