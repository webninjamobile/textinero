'use strict';

//Friends service used to communicate Friends REST endpoints
angular.module('friends').factory('Friends', ['$resource',
	function($resource) {
		return $resource('friends/:friendId', { friendId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);