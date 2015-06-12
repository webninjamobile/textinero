'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chat = mongoose.model('Chat'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, chat;

/**
 * Chat routes tests
 */
describe('Chat CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Chat
		user.save(function() {
			chat = {
				name: 'Chat Name'
			};

			done();
		});
	});

	it('should be able to save Chat instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat
				agent.post('/chats')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle Chat save error
						if (chatSaveErr) done(chatSaveErr);

						// Get a list of Chats
						agent.get('/chats')
							.end(function(chatsGetErr, chatsGetRes) {
								// Handle Chat save error
								if (chatsGetErr) done(chatsGetErr);

								// Get Chats list
								var chats = chatsGetRes.body;

								// Set assertions
								(chats[0].user._id).should.equal(userId);
								(chats[0].name).should.match('Chat Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Chat instance if not logged in', function(done) {
		agent.post('/chats')
			.send(chat)
			.expect(401)
			.end(function(chatSaveErr, chatSaveRes) {
				// Call the assertion callback
				done(chatSaveErr);
			});
	});

	it('should not be able to save Chat instance if no name is provided', function(done) {
		// Invalidate name field
		chat.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat
				agent.post('/chats')
					.send(chat)
					.expect(400)
					.end(function(chatSaveErr, chatSaveRes) {
						// Set message assertion
						(chatSaveRes.body.message).should.match('Please fill Chat name');
						
						// Handle Chat save error
						done(chatSaveErr);
					});
			});
	});

	it('should be able to update Chat instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat
				agent.post('/chats')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle Chat save error
						if (chatSaveErr) done(chatSaveErr);

						// Update Chat name
						chat.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Chat
						agent.put('/chats/' + chatSaveRes.body._id)
							.send(chat)
							.expect(200)
							.end(function(chatUpdateErr, chatUpdateRes) {
								// Handle Chat update error
								if (chatUpdateErr) done(chatUpdateErr);

								// Set assertions
								(chatUpdateRes.body._id).should.equal(chatSaveRes.body._id);
								(chatUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Chats if not signed in', function(done) {
		// Create new Chat model instance
		var chatObj = new Chat(chat);

		// Save the Chat
		chatObj.save(function() {
			// Request Chats
			request(app).get('/chats')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Chat if not signed in', function(done) {
		// Create new Chat model instance
		var chatObj = new Chat(chat);

		// Save the Chat
		chatObj.save(function() {
			request(app).get('/chats/' + chatObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', chat.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Chat instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Chat
				agent.post('/chats')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle Chat save error
						if (chatSaveErr) done(chatSaveErr);

						// Delete existing Chat
						agent.delete('/chats/' + chatSaveRes.body._id)
							.send(chat)
							.expect(200)
							.end(function(chatDeleteErr, chatDeleteRes) {
								// Handle Chat error error
								if (chatDeleteErr) done(chatDeleteErr);

								// Set assertions
								(chatDeleteRes.body._id).should.equal(chatSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Chat instance if not signed in', function(done) {
		// Set Chat user 
		chat.user = user;

		// Create new Chat model instance
		var chatObj = new Chat(chat);

		// Save the Chat
		chatObj.save(function() {
			// Try deleting Chat
			request(app).delete('/chats/' + chatObj._id)
			.expect(401)
			.end(function(chatDeleteErr, chatDeleteRes) {
				// Set message assertion
				(chatDeleteRes.body.message).should.match('User is not logged in');

				// Handle Chat error error
				done(chatDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Chat.remove().exec();
		done();
	});
});