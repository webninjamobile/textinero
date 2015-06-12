'use strict';

(function() {
	// Callbacks Controller Spec
	describe('Callbacks Controller Tests', function() {
		// Initialize global variables
		var CallbacksController,
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

			// Initialize the Callbacks controller.
			CallbacksController = $controller('CallbacksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Callback object fetched from XHR', inject(function(Callbacks) {
			// Create sample Callback using the Callbacks service
			var sampleCallback = new Callbacks({
				name: 'New Callback'
			});

			// Create a sample Callbacks array that includes the new Callback
			var sampleCallbacks = [sampleCallback];

			// Set GET response
			$httpBackend.expectGET('callbacks').respond(sampleCallbacks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.callbacks).toEqualData(sampleCallbacks);
		}));

		it('$scope.findOne() should create an array with one Callback object fetched from XHR using a callbackId URL parameter', inject(function(Callbacks) {
			// Define a sample Callback object
			var sampleCallback = new Callbacks({
				name: 'New Callback'
			});

			// Set the URL parameter
			$stateParams.callbackId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/callbacks\/([0-9a-fA-F]{24})$/).respond(sampleCallback);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.callback).toEqualData(sampleCallback);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Callbacks) {
			// Create a sample Callback object
			var sampleCallbackPostData = new Callbacks({
				name: 'New Callback'
			});

			// Create a sample Callback response
			var sampleCallbackResponse = new Callbacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Callback'
			});

			// Fixture mock form input values
			scope.name = 'New Callback';

			// Set POST response
			$httpBackend.expectPOST('callbacks', sampleCallbackPostData).respond(sampleCallbackResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Callback was created
			expect($location.path()).toBe('/callbacks/' + sampleCallbackResponse._id);
		}));

		it('$scope.update() should update a valid Callback', inject(function(Callbacks) {
			// Define a sample Callback put data
			var sampleCallbackPutData = new Callbacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Callback'
			});

			// Mock Callback in scope
			scope.callback = sampleCallbackPutData;

			// Set PUT response
			$httpBackend.expectPUT(/callbacks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/callbacks/' + sampleCallbackPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid callbackId and remove the Callback from the scope', inject(function(Callbacks) {
			// Create new Callback object
			var sampleCallback = new Callbacks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Callbacks array and include the Callback
			scope.callbacks = [sampleCallback];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/callbacks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCallback);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.callbacks.length).toBe(0);
		}));
	});
}());