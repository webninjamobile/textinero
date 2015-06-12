'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Callback = mongoose.model('Callback'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, callback;

/**
 * Callback routes tests
 */
describe('Callback CRUD tests', function() {
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

		// Save a user to the test db and create new Callback
		user.save(function() {
			callback = {
				name: 'Callback Name'
			};

			done();
		});
	});

	it('should be able to save Callback instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Callback
				agent.post('/callbacks')
					.send(callback)
					.expect(200)
					.end(function(callbackSaveErr, callbackSaveRes) {
						// Handle Callback save error
						if (callbackSaveErr) done(callbackSaveErr);

						// Get a list of Callbacks
						agent.get('/callbacks')
							.end(function(callbacksGetErr, callbacksGetRes) {
								// Handle Callback save error
								if (callbacksGetErr) done(callbacksGetErr);

								// Get Callbacks list
								var callbacks = callbacksGetRes.body;

								// Set assertions
								(callbacks[0].user._id).should.equal(userId);
								(callbacks[0].name).should.match('Callback Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Callback instance if not logged in', function(done) {
		agent.post('/callbacks')
			.send(callback)
			.expect(401)
			.end(function(callbackSaveErr, callbackSaveRes) {
				// Call the assertion callback
				done(callbackSaveErr);
			});
	});

	it('should not be able to save Callback instance if no name is provided', function(done) {
		// Invalidate name field
		callback.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Callback
				agent.post('/callbacks')
					.send(callback)
					.expect(400)
					.end(function(callbackSaveErr, callbackSaveRes) {
						// Set message assertion
						(callbackSaveRes.body.message).should.match('Please fill Callback name');
						
						// Handle Callback save error
						done(callbackSaveErr);
					});
			});
	});

	it('should be able to update Callback instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Callback
				agent.post('/callbacks')
					.send(callback)
					.expect(200)
					.end(function(callbackSaveErr, callbackSaveRes) {
						// Handle Callback save error
						if (callbackSaveErr) done(callbackSaveErr);

						// Update Callback name
						callback.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Callback
						agent.put('/callbacks/' + callbackSaveRes.body._id)
							.send(callback)
							.expect(200)
							.end(function(callbackUpdateErr, callbackUpdateRes) {
								// Handle Callback update error
								if (callbackUpdateErr) done(callbackUpdateErr);

								// Set assertions
								(callbackUpdateRes.body._id).should.equal(callbackSaveRes.body._id);
								(callbackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Callbacks if not signed in', function(done) {
		// Create new Callback model instance
		var callbackObj = new Callback(callback);

		// Save the Callback
		callbackObj.save(function() {
			// Request Callbacks
			request(app).get('/callbacks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Callback if not signed in', function(done) {
		// Create new Callback model instance
		var callbackObj = new Callback(callback);

		// Save the Callback
		callbackObj.save(function() {
			request(app).get('/callbacks/' + callbackObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', callback.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Callback instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Callback
				agent.post('/callbacks')
					.send(callback)
					.expect(200)
					.end(function(callbackSaveErr, callbackSaveRes) {
						// Handle Callback save error
						if (callbackSaveErr) done(callbackSaveErr);

						// Delete existing Callback
						agent.delete('/callbacks/' + callbackSaveRes.body._id)
							.send(callback)
							.expect(200)
							.end(function(callbackDeleteErr, callbackDeleteRes) {
								// Handle Callback error error
								if (callbackDeleteErr) done(callbackDeleteErr);

								// Set assertions
								(callbackDeleteRes.body._id).should.equal(callbackSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Callback instance if not signed in', function(done) {
		// Set Callback user 
		callback.user = user;

		// Create new Callback model instance
		var callbackObj = new Callback(callback);

		// Save the Callback
		callbackObj.save(function() {
			// Try deleting Callback
			request(app).delete('/callbacks/' + callbackObj._id)
			.expect(401)
			.end(function(callbackDeleteErr, callbackDeleteRes) {
				// Set message assertion
				(callbackDeleteRes.body.message).should.match('User is not logged in');

				// Handle Callback error error
				done(callbackDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Callback.remove().exec();
		done();
	});
});