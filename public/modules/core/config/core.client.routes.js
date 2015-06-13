'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);


angular.module('core', ['doowb.angular-pusher']).

	config(['PusherServiceProvider',
		function(PusherServiceProvider) {
			PusherServiceProvider
				.setToken('a395fe9917ab39b7b543')
				.setOptions({});
		}
	]);
