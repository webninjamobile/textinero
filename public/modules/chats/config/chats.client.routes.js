'use strict';

//Setting up route
angular.module('chats').config(['$stateProvider',
	function($stateProvider) {
		// Chats state routing
		$stateProvider.
		state('listChats', {
			url: '/chats',
			templateUrl: 'modules/chats/views/list-chats.client.view.html'
		}).
		state('createChat', {
			url: '/chats/create',
			templateUrl: 'modules/chats/views/create-chat.client.view.html'
		}).
		state('viewChat', {
			url: '/chats/:chatId',
			templateUrl: 'modules/chats/views/view-chat.client.view.html'
		}).
		state('editChat', {
			url: '/chats/:chatId/edit',
			templateUrl: 'modules/chats/views/edit-chat.client.view.html'
		});
	}
]);