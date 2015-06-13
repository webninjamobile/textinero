'use strict';

// Friends controller
angular.module('friends').controller('FriendsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Friends','Chats',
	function($scope, $stateParams, $location, Authentication, Friends,Chats) {
		$scope.authentication = Authentication;

		// Create new Friend
		$scope.create = function() {
			// Create new Friend object
			var friend = new Friends ({
				name: this.name,
				mobile:this.mobile
			});

			// Redirect after save
			friend.$save(function(response) {
				$location.path('friends/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Friend
		$scope.remove = function(friend) {
			if ( friend ) { 
				friend.$remove();

				for (var i in $scope.friends) {
					if ($scope.friends [i] === friend) {
						$scope.friends.splice(i, 1);
					}
				}
			} else {
				$scope.friend.$remove(function() {
					$location.path('friends');
				});
			}
		};

		// Update existing Friend
		$scope.update = function() {
			var friend = $scope.friend;

			friend.$update(function() {
				$location.path('friends/' + friend._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Friends
		$scope.find = function() {
			$scope.friends = Friends.query();
		};

		// Find existing Friend
		$scope.findOne = function() {
			$scope.friend = Friends.get({ 
				friendId: $stateParams.friendId
			});
		};

		/***/

		$scope.getChat = function(friend){
            $scope.friend.$promise.then(function (result) {
                console.log(friend);
                $scope.chats = Chats.friend({friend: friend._id});

                $scope.chats.$promise.then(function (result) {
                    $scope.chats = result;
                });
            });

		};

        $scope.sendMessage = function (message) {
            console.log($scope.chats);
            if (message && message !== '') {
                var chat = new Chats();
                chat.friend = $scope.friend._id;
                chat.message = message;

                chat.$save(function(response) {
                    $scope.chats.push({
                        message:message,
                        friend:{name:Authentication.user.username},
                        created:response.created
                    })
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });



                //$scope.chats.push();
                $scope.message = '';
            }
        };
	}


]);
