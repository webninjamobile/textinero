'use strict';

// Configuring the Articles module
angular.module('chats').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Chats', 'chats', '', '/chats/');
	}
]);
