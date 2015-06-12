'use strict';

//Callbacks service used to communicate Callbacks REST endpoints
angular.module('callbacks').factory('Callbacks', ['$resource',
	function($resource) {
		return $resource('callbacks/:callbackId', { callbackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);