'use strict';

//Setting up route
angular.module('friends').config(['$stateProvider',
	function($stateProvider) {
		// Friends state routing
		$stateProvider.
		state('listFriends', {
			url: '/friends',
			templateUrl: 'modules/friends/views/list-friends.client.view.html'
		}).
		state('createFriend', {
			url: '/friends/create',
			templateUrl: 'modules/friends/views/create-friend.client.view.html'
		}).
		state('viewFriend', {
			url: '/friends/:friendId',
			templateUrl: 'modules/friends/views/view-friend.client.view.html'
		}).
		state('editFriend', {
			url: '/friends/:friendId/edit',
			templateUrl: 'modules/friends/views/edit-friend.client.view.html'
		});
	}
]);