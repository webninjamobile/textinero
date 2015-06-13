'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var chats = require('../../app/controllers/chats.server.controller');

	// Chats Routes
	app.route('/chats')
		.get(chats.list)
		.post(users.requiresLogin, chats.create);

	app.route('/chats/friend/:friend')
		.get(users.requiresLogin, chats.friend);

	app.route('/chats/:chatId')
		.get(chats.read)
		.put(users.requiresLogin, chats.hasAuthorization, chats.update)
		.delete(users.requiresLogin, chats.hasAuthorization, chats.delete);

	// Finish by binding the Chat middleware
	app.param('chatId', chats.chatByID);
	app.param('friend', chats.friend);
};
