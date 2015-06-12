'use strict';

// Chats controller
angular.module('chats').controller('ChatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Chats',
	function($scope, $stateParams, $location, Authentication, Chats) {
		$scope.authentication = Authentication;

		// Create new Chat
		$scope.create = function() {
			// Create new Chat object
			var chat = new Chats ({
				name: this.name
			});

			// Redirect after save
			chat.$save(function(response) {
				$location.path('chats/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Chat
		$scope.remove = function(chat) {
			if ( chat ) { 
				chat.$remove();

				for (var i in $scope.chats) {
					if ($scope.chats [i] === chat) {
						$scope.chats.splice(i, 1);
					}
				}
			} else {
				$scope.chat.$remove(function() {
					$location.path('chats');
				});
			}
		};

		// Update existing Chat
		$scope.update = function() {
			var chat = $scope.chat;

			chat.$update(function() {
				$location.path('chats/' + chat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Chats
		$scope.find = function() {
			$scope.chats = Chats.query();
		};

		// Find existing Chat
		$scope.findOne = function() {
			$scope.chat = Chats.get({ 
				chatId: $stateParams.chatId
			});
		};
	}
]);