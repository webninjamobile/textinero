'use strict';

// Callbacks controller
angular.module('callbacks').controller('CallbacksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Callbacks',
	function($scope, $stateParams, $location, Authentication, Callbacks) {
		$scope.authentication = Authentication;

		// Create new Callback
		$scope.create = function() {
			// Create new Callback object
			var callback = new Callbacks ({
				name: this.name
			});

			// Redirect after save
			callback.$save(function(response) {
				$location.path('callbacks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Callback
		$scope.remove = function(callback) {
			if ( callback ) { 
				callback.$remove();

				for (var i in $scope.callbacks) {
					if ($scope.callbacks [i] === callback) {
						$scope.callbacks.splice(i, 1);
					}
				}
			} else {
				$scope.callback.$remove(function() {
					$location.path('callbacks');
				});
			}
		};

		// Update existing Callback
		$scope.update = function() {
			var callback = $scope.callback;

			callback.$update(function() {
				$location.path('callbacks/' + callback._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Callbacks
		$scope.find = function() {
			$scope.callbacks = Callbacks.query();
		};

		// Find existing Callback
		$scope.findOne = function() {
			$scope.callback = Callbacks.get({ 
				callbackId: $stateParams.callbackId
			});
		};
	}
]);