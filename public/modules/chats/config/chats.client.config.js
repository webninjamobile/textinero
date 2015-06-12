'use strict';

// Configuring the Articles module
angular.module('chats').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Chats', 'chats', 'dropdown', '/chats(/create)?');
		Menus.addSubMenuItem('topbar', 'chats', 'List Chats', 'chats');
		Menus.addSubMenuItem('topbar', 'chats', 'New Chat', 'chats/create');
	}
]);