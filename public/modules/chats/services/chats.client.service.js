'use strict';

//Chats service used to communicate Chats REST endpoints
angular.module('chats').factory('Chats', ['$resource',
	function($resource) {
		return $resource('chats/:chatId', { chatId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			friend:{
				url:'/chats/friend/:friend',
				params: {friend: '@friend'},
				method: 'GET',
				isArray:true
			}
		});
	}
]);
