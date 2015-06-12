'use strict';

(function() {
	// Chats Controller Spec
	describe('Chats Controller Tests', function() {
		// Initialize global variables
		var ChatsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Chats controller.
			ChatsController = $controller('ChatsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Chat object fetched from XHR', inject(function(Chats) {
			// Create sample Chat using the Chats service
			var sampleChat = new Chats({
				name: 'New Chat'
			});

			// Create a sample Chats array that includes the new Chat
			var sampleChats = [sampleChat];

			// Set GET response
			$httpBackend.expectGET('chats').respond(sampleChats);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.chats).toEqualData(sampleChats);
		}));

		it('$scope.findOne() should create an array with one Chat object fetched from XHR using a chatId URL parameter', inject(function(Chats) {
			// Define a sample Chat object
			var sampleChat = new Chats({
				name: 'New Chat'
			});

			// Set the URL parameter
			$stateParams.chatId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/chats\/([0-9a-fA-F]{24})$/).respond(sampleChat);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.chat).toEqualData(sampleChat);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Chats) {
			// Create a sample Chat object
			var sampleChatPostData = new Chats({
				name: 'New Chat'
			});

			// Create a sample Chat response
			var sampleChatResponse = new Chats({
				_id: '525cf20451979dea2c000001',
				name: 'New Chat'
			});

			// Fixture mock form input values
			scope.name = 'New Chat';

			// Set POST response
			$httpBackend.expectPOST('chats', sampleChatPostData).respond(sampleChatResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Chat was created
			expect($location.path()).toBe('/chats/' + sampleChatResponse._id);
		}));

		it('$scope.update() should update a valid Chat', inject(function(Chats) {
			// Define a sample Chat put data
			var sampleChatPutData = new Chats({
				_id: '525cf20451979dea2c000001',
				name: 'New Chat'
			});

			// Mock Chat in scope
			scope.chat = sampleChatPutData;

			// Set PUT response
			$httpBackend.expectPUT(/chats\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/chats/' + sampleChatPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid chatId and remove the Chat from the scope', inject(function(Chats) {
			// Create new Chat object
			var sampleChat = new Chats({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Chats array and include the Chat
			scope.chats = [sampleChat];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/chats\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChat);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.chats.length).toBe(0);
		}));
	});
}());