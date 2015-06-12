'use strict';

//Setting up route
angular.module('callbacks').config(['$stateProvider',
	function($stateProvider) {
		// Callbacks state routing
		$stateProvider.
		state('listCallbacks', {
			url: '/callbacks',
			templateUrl: 'modules/callbacks/views/list-callbacks.client.view.html'
		}).
		state('createCallback', {
			url: '/callbacks/create',
			templateUrl: 'modules/callbacks/views/create-callback.client.view.html'
		}).
		state('viewCallback', {
			url: '/callbacks/:callbackId',
			templateUrl: 'modules/callbacks/views/view-callback.client.view.html'
		}).
		state('editCallback', {
			url: '/callbacks/:callbackId/edit',
			templateUrl: 'modules/callbacks/views/edit-callback.client.view.html'
		});
	}
]);