'use strict';

// Configuring the Articles module
angular.module('friends').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Friends', 'friends', 'dropdown', '/friends(/create)?');
		Menus.addSubMenuItem('topbar', 'friends', 'List Friends', 'friends');
		Menus.addSubMenuItem('topbar', 'friends', 'New Friend', 'friends/create');
	}
]);