'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Friend = mongoose.model('Friend'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, friend;

/**
 * Friend routes tests
 */
describe('Friend CRUD tests', function() {
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

		// Save a user to the test db and create new Friend
		user.save(function() {
			friend = {
				name: 'Friend Name'
			};

			done();
		});
	});

	it('should be able to save Friend instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Friend
				agent.post('/friends')
					.send(friend)
					.expect(200)
					.end(function(friendSaveErr, friendSaveRes) {
						// Handle Friend save error
						if (friendSaveErr) done(friendSaveErr);

						// Get a list of Friends
						agent.get('/friends')
							.end(function(friendsGetErr, friendsGetRes) {
								// Handle Friend save error
								if (friendsGetErr) done(friendsGetErr);

								// Get Friends list
								var friends = friendsGetRes.body;

								// Set assertions
								(friends[0].user._id).should.equal(userId);
								(friends[0].name).should.match('Friend Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Friend instance if not logged in', function(done) {
		agent.post('/friends')
			.send(friend)
			.expect(401)
			.end(function(friendSaveErr, friendSaveRes) {
				// Call the assertion callback
				done(friendSaveErr);
			});
	});

	it('should not be able to save Friend instance if no name is provided', function(done) {
		// Invalidate name field
		friend.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Friend
				agent.post('/friends')
					.send(friend)
					.expect(400)
					.end(function(friendSaveErr, friendSaveRes) {
						// Set message assertion
						(friendSaveRes.body.message).should.match('Please fill Friend name');
						
						// Handle Friend save error
						done(friendSaveErr);
					});
			});
	});

	it('should be able to update Friend instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Friend
				agent.post('/friends')
					.send(friend)
					.expect(200)
					.end(function(friendSaveErr, friendSaveRes) {
						// Handle Friend save error
						if (friendSaveErr) done(friendSaveErr);

						// Update Friend name
						friend.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Friend
						agent.put('/friends/' + friendSaveRes.body._id)
							.send(friend)
							.expect(200)
							.end(function(friendUpdateErr, friendUpdateRes) {
								// Handle Friend update error
								if (friendUpdateErr) done(friendUpdateErr);

								// Set assertions
								(friendUpdateRes.body._id).should.equal(friendSaveRes.body._id);
								(friendUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Friends if not signed in', function(done) {
		// Create new Friend model instance
		var friendObj = new Friend(friend);

		// Save the Friend
		friendObj.save(function() {
			// Request Friends
			request(app).get('/friends')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Friend if not signed in', function(done) {
		// Create new Friend model instance
		var friendObj = new Friend(friend);

		// Save the Friend
		friendObj.save(function() {
			request(app).get('/friends/' + friendObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', friend.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Friend instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Friend
				agent.post('/friends')
					.send(friend)
					.expect(200)
					.end(function(friendSaveErr, friendSaveRes) {
						// Handle Friend save error
						if (friendSaveErr) done(friendSaveErr);

						// Delete existing Friend
						agent.delete('/friends/' + friendSaveRes.body._id)
							.send(friend)
							.expect(200)
							.end(function(friendDeleteErr, friendDeleteRes) {
								// Handle Friend error error
								if (friendDeleteErr) done(friendDeleteErr);

								// Set assertions
								(friendDeleteRes.body._id).should.equal(friendSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Friend instance if not signed in', function(done) {
		// Set Friend user 
		friend.user = user;

		// Create new Friend model instance
		var friendObj = new Friend(friend);

		// Save the Friend
		friendObj.save(function() {
			// Try deleting Friend
			request(app).delete('/friends/' + friendObj._id)
			.expect(401)
			.end(function(friendDeleteErr, friendDeleteRes) {
				// Set message assertion
				(friendDeleteRes.body.message).should.match('User is not logged in');

				// Handle Friend error error
				done(friendDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Friend.remove().exec();
		done();
	});
});